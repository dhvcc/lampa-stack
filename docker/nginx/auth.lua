local _M = {}

function _M.is_authorized_email(email)
    local f = io.open("/etc/nginx/auth/authorized_emails.conf", "r")
    if not f then
        ngx.log(ngx.ERR, "Failed to open authorized_emails.conf")
        return false
    end

    for line in f:lines() do
        if line:gsub("%s+", "") == email then
            f:close()
            return true
        end
    end
    f:close()
    return false
end

function _M.validate_jwt(auth_token)
    if not auth_token then
        return nil, "No auth token found"
    end

    -- Basic JWT structure validation
    local jwt_parts = {}
    for part in auth_token:gmatch("[^%.]+") do
        table.insert(jwt_parts, part)
    end

    if #jwt_parts ~= 3 then
        return nil, "Invalid token format"
    end

    -- Decode payload (middle part)
    local payload = ngx.decode_base64(jwt_parts[2])
    if not payload then
        return nil, "Invalid token payload"
    end

    -- Parse payload JSON
    local cjson = require "cjson"
    local ok, user_data = pcall(cjson.decode, payload)
    if not ok or not user_data.email then
        return nil, "Invalid token data"
    end

    return user_data
end

function _M.require_auth()
    -- Initialize request
    ngx.req.read_body()

    -- Get cookie from headers
    local auth_token = nil
    local headers = ngx.req.get_headers()
    local cookie = headers["cookie"]
    
    if cookie then
        for cookie_part in cookie:gmatch("[^;]+") do
            local name, value = cookie_part:match("^%s*(.-)%s*=%s*(.-)%s*$")
            if name == "lampa_stack_auth_cookie" then
                auth_token = value
                break
            end
        end
    end

    local user_data, err = _M.validate_jwt(auth_token)
    
    if not user_data then
        ngx.status = 401
        ngx.header.content_type = "application/json"
        ngx.say(string.format('{"error":"%s"}', err))
        return ngx.exit(401)
    end

    -- Store user info for potential use in other blocks
    ngx.ctx.user = user_data
end

function _M.handle_cub_auth()
    if ngx.var.uri ~= "/auth/cub" then
        _M.log_request_details("Invalid auth endpoint accessed:")
        ngx.status = 404
        return ngx.exit(404)
    end

    -- Initialize request
    ngx.req.read_body()

    -- Check method
    if ngx.var.request_method ~= "POST" then
        ngx.log(ngx.ERR, "Method not allowed: ", ngx.var.request_method)
        ngx.status = 405
        ngx.header.content_type = "application/json"
        ngx.say('{"error":"Method not allowed"}')
        return ngx.exit(405)
    end

    -- Get token from headers
    local headers = ngx.req.get_headers()
    local token = headers["token"]
    ngx.log(ngx.ERR, "Headers: ", require("cjson").encode(headers))
    ngx.log(ngx.ERR, "Token: ", token)

    if not token then
        ngx.status = 400
        ngx.header.content_type = "application/json"
        ngx.say('{"error":"Token header is required"}')
        return ngx.exit(400)
    end

    -- Create HTTP client
    local http = require "resty.http"
    local httpc = http.new()
    
    -- Make request to cub.red
    ngx.log(ngx.ERR, "Making request to cub.red...")
    local res, err = httpc:request_uri("https://cub.red/api/users/get", {
        method = "GET",
        headers = {
            ["Accept"] = "application/json",
            ["User-Agent"] = "Lampa-Stack/1.0",
            ["Token"] = token
        },
        ssl_verify = false  -- Skip SSL verification for now
    })

    if not res then
        ngx.log(ngx.ERR, "Failed to reach cub.red with error: ", err)
        ngx.status = 500
        ngx.header.content_type = "application/json"
        ngx.say(string.format('{"error":"Failed to reach cub.red: %s"}', err))
        return ngx.exit(500)
    end

    ngx.log(ngx.ERR, "Response status: ", res.status)
    ngx.log(ngx.ERR, "Response body: ", res.body)

    -- Parse response
    local cjson = require "cjson"
    local data = cjson.decode(res.body)
    if not data.secuses or not data.user then
        ngx.status = 401
        ngx.header.content_type = "application/json"
        ngx.say('{"error":"Invalid token"}')
        return ngx.exit(401)
    end

    -- Check if email is authorized
    if not _M.is_authorized_email(data.user.email) then
        ngx.status = 403
        ngx.header.content_type = "application/json"
        ngx.say('{"error":"Email not authorized"}')
        return ngx.exit(403)
    end

    -- Create JWT payload
    local payload = {
        email = data.user.email,
        user_id = data.user.id
    }

    -- Base64url encode the header and payload
    local b64 = require "ngx.base64"
    local header = b64.encode_base64url('{"typ":"JWT","alg":"HS256"}')
    local payload_json = cjson.encode(payload)
    local payload_b64 = b64.encode_base64url(payload_json)

    -- Create JWT token
    local jwt = header .. "." .. payload_b64 .. ".signature"

    -- Set cookie
    ngx.header["Set-Cookie"] = "lampa_stack_auth_cookie=" .. jwt .. "; Path=/; HttpOnly; SameSite=Strict"
    
    -- Return success
    ngx.status = 200
    ngx.header.content_type = "application/json"
    ngx.say('{"success":true}')
end

return _M 