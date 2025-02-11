(function () {
    'use strict';

    const localhost = "/";
    const syncInterval = 10000; // 10 seconds
    const exportExcludeKeys = [
        'vuetorrent_dashboard',
        'vuetorrent_logs',
        'vuetorrent_navbar',
        'region',
        'screensaver_aerial_items',
        'activity',
    ]

    function getAccountUrl(path) {
        const email = Lampa.Storage.get('account_email');
        if (!email) return null;
        return `${localhost}/storage/${path}?path=backup&account_email=${encodeURIComponent(email)}`;
    }

    function mergeData(existing, incoming, force = false) {
        // Handle arrays
        if (Array.isArray(existing) && Array.isArray(incoming)) {
            return [...new Set([...existing, ...incoming])];
        }

        // Handle objects
        if (typeof existing === 'object' && existing !== null &&
            typeof incoming === 'object' && incoming !== null) {
            return force ?
                $.extend(true, {}, existing, incoming) :
                $.extend(true, {}, incoming, existing);
        }

        // For primitive types, use force flag to determine priority
        return force ? incoming : existing;
    }

    const Backup = {
        export: function () {
            const url = getAccountUrl('set');
            if (!url) {
                console.log('[Backup] No email set, skipping export');
                return;
            }

            const data = { ...localStorage };
            for (let key of exportExcludeKeys) {
                delete data[key];
            }

            $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (response) {
                    if (response.success) {
                        console.log('[Backup] Export successful');
                    } else {
                        console.log('[Backup] Export failed:', response);
                    }
                },
                error: function (error) {
                    console.log('[Backup] Export error:', error);
                }
            });
        },

        /**
         * Import backup data from server
         * @param {Object} options Import options
         * @param {boolean} options.force If true, incoming changes will override existing values during merge. If false, existing values take precedence.
         * @param {boolean} options.initial Indicates whether this is the initial import.
         */
        import: function (options = {}) {
            const url = getAccountUrl('get');
            if (!url) {
                console.log('[Backup] No email set, skipping import');
                return;
            }

            $.ajax({
                url: url,
                type: 'GET',
                success: function (response) {
                    if (response.data) {
                        const data = JSON.parse(response.data);

                        for (let key in data) {
                            try {
                                let existingValue = localStorage.getItem(key);
                                let incomingValue = data[key];

                                // Try to parse JSON values
                                try { existingValue = JSON.parse(existingValue); } catch (e) { }
                                try { incomingValue = JSON.parse(incomingValue); } catch (e) { }

                                // Merge values based on their types
                                const mergedValue = mergeData(existingValue, incomingValue, options.force);

                                // Store the result back
                                localStorage.setItem(key,
                                    typeof mergedValue === 'object' ?
                                        JSON.stringify(mergedValue) :
                                        mergedValue
                                );
                            } catch (e) {
                                console.log('[Backup] Error merging key:', key, e);
                                // On error, fallback to simple override based on force flag
                                if (options.force) {
                                    localStorage.setItem(key, data[key]);
                                }
                            }
                        }
                        console.log('[Backup] Import successful');

                        if (options.initial) {
                            window.initial_sync = true;
                        }
                    }
                },
                error: function (error) {
                    console.log('[Backup] Import error:', error);
                }
            });
        },

        startAutoSync: function () {
            // Set up interval for continuous sync
            setInterval(() => {
                // this.import();
                this.export();
            }, syncInterval);
        }
    };

    function disableCubSync() {
        Lampa.Lang.add({
            settings_cub_sync: {
                ru: 'Аккаунт',
                en: 'Account',
                uk: 'Аккаунт',
                zh: '账户',
            }
        })
        // Disable Christmas decorations
        Lampa.Template.add(
            "DisableOtherSync",
            "<style> div[data-name=\"account_use\"], .settings--account-premium, .settings--account-status, .settings-param-title, .settings--account-user-sync, .settings--account-user-backup {display: none;} </style>"
        );
        $("body").append(Lampa.Template.get("DisableOtherSync", {}, true));
    }
    disableCubSync();

    Lampa.LampaBackup = Backup;
    if (!window.initial_sync) {
        // Backup.import({ force: true });
        Backup.startAutoSync();
    }

})();
