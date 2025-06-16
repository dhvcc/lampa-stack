(function () {
    'use strict';
  
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
  
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
  
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
  
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
  
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }
  
    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }
  
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
  
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
  
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  
      return arr2;
    }
  
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
  
    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  
      if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;
  
          var F = function () {};
  
          return {
            s: F,
            n: function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function (e) {
              throw e;
            },
            f: F
          };
        }
  
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
  
      var normalCompletion = true,
          didErr = false,
          err;
      return {
        s: function () {
          it = it.call(o);
        },
        n: function () {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function (e) {
          didErr = true;
          err = e;
        },
        f: function () {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        }
      };
    }
  
    function State(object) {
      this.state = object.state;
  
      this.start = function () {
        this.dispath(this.state);
      };
  
      this.dispath = function (action_name) {
        var action = object.transitions[action_name];
  
        if (action) {
          action.call(this, this);
        } else {
          console.log('invalid action');
        }
      };
    }
  
    var Player = /*#__PURE__*/function () {
      function Player(object, video) {
        var _this = this;
  
        _classCallCheck(this, Player);
  
        this.paused = false;
        this.display = false;
        this.ended = false;
        this.listener = Lampa.Subscribe();
        this.html = $("\n            <div class=\"cardify-trailer\">\n                <div class=\"cardify-trailer__youtube\">\n                    <div class=\"cardify-trailer__youtube-iframe\"></div>\n                    <div class=\"cardify-trailer__youtube-line one\"></div>\n                    <div class=\"cardify-trailer__youtube-line two\"></div>\n                </div>\n\n                <div class=\"cardify-trailer__controlls\">\n                    <div class=\"cardify-trailer__title\"></div>\n                    <div class=\"cardify-trailer__remote\">\n                        <div class=\"cardify-trailer__remote-icon\">\n                            <svg width=\"37\" height=\"37\" viewBox=\"0 0 37 37\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                                <path d=\"M32.5196 7.22042L26.7992 12.9408C27.8463 14.5217 28.4561 16.4175 28.4561 18.4557C28.4561 20.857 27.6098 23.0605 26.1991 24.7844L31.8718 30.457C34.7226 27.2724 36.4561 23.0667 36.4561 18.4561C36.4561 14.2059 34.983 10.2998 32.5196 7.22042Z\" fill=\"white\" fill-opacity=\"0.28\"/>\n                                <path d=\"M31.262 31.1054L31.1054 31.262C31.158 31.2102 31.2102 31.158 31.262 31.1054Z\" fill=\"white\" fill-opacity=\"0.28\"/>\n                                <path d=\"M29.6917 32.5196L23.971 26.7989C22.3901 27.846 20.4943 28.4557 18.4561 28.4557C16.4179 28.4557 14.5221 27.846 12.9412 26.7989L7.22042 32.5196C10.2998 34.983 14.2059 36.4561 18.4561 36.4561C22.7062 36.4561 26.6123 34.983 29.6917 32.5196Z\" fill=\"white\" fill-opacity=\"0.28\"/>\n                                <path d=\"M5.81349 31.2688L5.64334 31.0986C5.69968 31.1557 5.7564 31.2124 5.81349 31.2688Z\" fill=\"white\" fill-opacity=\"0.28\"/>\n                                <path d=\"M5.04033 30.4571L10.7131 24.7844C9.30243 23.0605 8.4561 20.857 8.4561 18.4557C8.4561 16.4175 9.06588 14.5217 10.113 12.9408L4.39251 7.22037C1.9291 10.2998 0.456055 14.2059 0.456055 18.4561C0.456054 23.0667 2.18955 27.2724 5.04033 30.4571Z\" fill=\"white\" fill-opacity=\"0.28\"/>\n                                <path d=\"M6.45507 5.04029C9.63973 2.18953 13.8455 0.456055 18.4561 0.456055C23.0667 0.456054 27.2724 2.18955 30.4571 5.04034L24.7847 10.7127C23.0609 9.30207 20.8573 8.45575 18.4561 8.45575C16.0549 8.45575 13.8513 9.30207 12.1275 10.7127L6.45507 5.04029Z\" fill=\"white\" fill-opacity=\"0.28\"/>\n                                <circle cx=\"18.4565\" cy=\"18.4561\" r=\"7\" fill=\"white\"/>\n                            </svg>\n                        </div>\n                        <div class=\"cardify-trailer__remote-text\">".concat(Lampa.Lang.translate('cardify_enable_sound'), "</div>\n                    </div>\n                </div>\n            </div>\n        "));
  
        if (typeof YT !== 'undefined' && YT.Player) {
          this.youtube = new YT.Player(this.html.find('.cardify-trailer__youtube-iframe')[0], {
            height: window.innerHeight * 2,
            width: window.innerWidth,
            playerVars: {
              'controls': 1,
              'showinfo': 0,
              'autohide': 1,
              'modestbranding': 1,
              'autoplay': 0,
              'disablekb': 1,
              'fs': 0,
              'enablejsapi': 1,
              'playsinline': 1,
              'rel': 0,
              'suggestedQuality': 'hd1080',
              'setPlaybackQuality': 'hd1080',
              'mute': 1
            },
            videoId: video.id,
            //'zSpYWxX4JdY',//'jk7jjaFs09U',
            //videoId: 'jk7jjaFs09U',
            events: {
              onReady: function onReady(event) {
                _this.loaded = true;
  
                _this.listener.send('loaded');
              },
              onStateChange: function onStateChange(state) {
                if (state.data == YT.PlayerState.PLAYING) {
                  _this.paused = false;
                  clearInterval(_this.timer);
                  _this.timer = setInterval(function () {
                    var left = _this.youtube.getDuration() - _this.youtube.getCurrentTime();
  
                    var toend = 13;
                    var fade = 5;
  
                    if (left <= toend + fade) {
                      var vol = 1 - (toend + fade - left) / fade;
  
                      _this.youtube.setVolume(Math.max(0, vol * 100));
  
                      if (left <= toend) {
                        clearInterval(_this.timer);
  
                        _this.listener.send('ended');
                      }
                    }
                  }, 100);
  
                  _this.listener.send('play');
  
                  if (window.cardify_fist_unmute) _this.unmute();
                }
  
                if (state.data == YT.PlayerState.PAUSED) {
                  _this.paused = true;
                  clearInterval(_this.timer);
  
                  _this.listener.send('paused');
                }
  
                if (state.data == YT.PlayerState.ENDED) {
                  _this.listener.send('ended');
                }
  
                if (state.data == YT.PlayerState.BUFFERING) {
                  state.target.setPlaybackQuality('hd1080');
                }
              },
              onError: function onError(e) {
                _this.loaded = false;
  
                _this.listener.send('error');
              }
            }
          });
        }
      }
  
      _createClass(Player, [{
        key: "play",
        value: function play() {
          try {
            this.youtube.playVideo();
          } catch (e) {}
        }
      }, {
        key: "pause",
        value: function pause() {
          try {
            this.youtube.pauseVideo();
          } catch (e) {}
        }
      }, {
        key: "unmute",
        value: function unmute() {
          try {
            this.youtube.unMute();
            this.html.find('.cardify-trailer__remote').remove();
            window.cardify_fist_unmute = true;
          } catch (e) {}
        }
      }, {
        key: "show",
        value: function show() {
          this.html.addClass('display');
          this.display = true;
        }
      }, {
        key: "hide",
        value: function hide() {
          this.html.removeClass('display');
          this.display = false;
        }
      }, {
        key: "render",
        value: function render() {
          return this.html;
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this.loaded = false;
          this.display = false;
  
          try {
            this.youtube.destroy();
          } catch (e) {}
  
          clearInterval(this.timer);
          this.html.remove();
        }
      }]);
  
      return Player;
    }();
  
    var Trailer = /*#__PURE__*/function () {
      function Trailer(object, video) {
        var _this = this;
  
        _classCallCheck(this, Trailer);
  
        object.activity.trailer_ready = true;
        this.object = object;
        this.video = video;
        this.player;
        this.background = this.object.activity.render().find('.full-start__background');
        this.startblock = this.object.activity.render().find('.cardify');
        this.head = $('.head');
        this.timelauch = 1200;
        this.firstlauch = false;
        this.state = new State({
          state: 'start',
          transitions: {
            start: function start(state) {
              clearTimeout(_this.timer_load);
              if (_this.player.display) state.dispath('play');else if (_this.player.loaded) {
                _this.animate();
  
                _this.timer_load = setTimeout(function () {
                  state.dispath('load');
                }, _this.timelauch);
              }
            },
            load: function load(state) {
              if (_this.player.loaded && Lampa.Controller.enabled().name == 'full_start' && _this.same()) state.dispath('play');
            },
            play: function play() {
              _this.player.play();
            },
            toggle: function toggle(state) {
              clearTimeout(_this.timer_load);
  
              if (Lampa.Controller.enabled().name == 'cardify_trailer') ; else if (Lampa.Controller.enabled().name == 'full_start' && _this.same()) {
                state.start();
              } else if (_this.player.display) {
                state.dispath('hide');
              }
            },
            hide: function hide() {
              _this.player.pause();
  
              _this.player.hide();
  
              _this.background.removeClass('nodisplay');
  
              _this.startblock.removeClass('nodisplay');
  
              _this.head.removeClass('nodisplay');
  
              _this.object.activity.render().find('.cardify-preview__loader').width(0);
            }
          }
        });
        this.start();
      }
  
      _createClass(Trailer, [{
        key: "same",
        value: function same() {
          return Lampa.Activity.active().activity === this.object.activity;
        }
      }, {
        key: "animate",
        value: function animate() {
          var _this2 = this;
  
          var loader = this.object.activity.render().find('.cardify-preview__loader').width(0);
          var started = Date.now();
          clearInterval(this.timer_anim);
          this.timer_anim = setInterval(function () {
            var left = Date.now() - started;
            if (left > _this2.timelauch) clearInterval(_this2.timer_anim);
            loader.width(Math.round(left / _this2.timelauch * 100) + '%');
          }, 100);
        }
      }, {
        key: "preview",
        value: function preview() {
          var preview = $("\n            <div class=\"cardify-preview\">\n                <div>\n                    <img class=\"cardify-preview__img\" />\n                    <div class=\"cardify-preview__line one\"></div>\n                    <div class=\"cardify-preview__line two\"></div>\n                    <div class=\"cardify-preview__loader\"></div>\n                </div>\n            </div>\n        ");
          Lampa.Utils.imgLoad($('img', preview), this.video.img, function () {
            $('img', preview).addClass('loaded');
          });
          this.object.activity.render().find('.cardify__right').append(preview);
        }
      }, {
        key: "controll",
        value: function controll() {
          var _this3 = this;
  
          var out = function out() {
            _this3.state.dispath('hide');
  
            Lampa.Controller.toggle('full_start');
          };
  
          Lampa.Controller.add('cardify_trailer', {
            toggle: function toggle() {
              Lampa.Controller.clear();
            },
            enter: function enter() {
              _this3.player.unmute();
            },
            left: out.bind(this),
            up: out.bind(this),
            down: out.bind(this),
            right: out.bind(this),
            back: function back() {
              _this3.player.destroy();
  
              _this3.object.activity.render().find('.cardify-preview').remove();
  
              out();
            }
          });
          Lampa.Controller.toggle('cardify_trailer');
        }
      }, {
        key: "start",
        value: function start() {
          var _this4 = this;
  
          var _self = this; // Events //
  
  
          var toggle = function toggle(e) {
            _self.state.dispath('toggle');
          };
  
          var destroy = function destroy(e) {
            if (e.type == 'destroy' && e.object.activity === _self.object.activity) remove();
          };
  
          var remove = function remove() {
            Lampa.Listener.remove('activity', destroy);
            Lampa.Controller.listener.remove('toggle', toggle);
  
            _self.destroy();
          };
  
          Lampa.Listener.follow('activity', destroy);
          Lampa.Controller.listener.follow('toggle', toggle); // Player //
  
          this.player = new Player(this.object, this.video);
          this.player.listener.follow('loaded', function () {
            _this4.preview();
  
            _this4.state.start();
          });
          this.player.listener.follow('play', function () {
            clearTimeout(_this4.timer_show);
  
            if (!_this4.firstlauch) {
              _this4.firstlauch = true;
              _this4.timelauch = 5000;
            }
  
            _this4.timer_show = setTimeout(function () {
              _this4.player.show();
  
              _this4.background.addClass('nodisplay');
  
              _this4.startblock.addClass('nodisplay');
  
              _this4.head.addClass('nodisplay');
  
              _this4.controll();
            }, 500);
          });
          this.player.listener.follow('ended,error', function () {
            _this4.state.dispath('hide');
  
            if (Lampa.Controller.enabled().name !== 'full_start') Lampa.Controller.toggle('full_start');
  
            _this4.object.activity.render().find('.cardify-preview').remove();
  
            setTimeout(remove, 300);
          });
          this.object.activity.render().find('.activity__body').prepend(this.player.render()); // Start //
  
          this.state.start();
        }
      }, {
        key: "destroy",
        value: function destroy() {
          clearTimeout(this.timer_load);
          clearTimeout(this.timer_show);
          clearInterval(this.timer_anim);
          this.player.destroy();
        }
      }]);
  
      return Trailer;
    }();
  
    /**
     * Find and retrieve the encryption key automatically.
     * @param {string} str - The input encrypted string.
     * @returns {number} - The encryption key found, or 0 if not found.
     */
    // str is used to get the input of encrypted string
    var wordBank = ['I ', 'You ', 'We ', 'They ', 'He ', 'She ', 'It ', ' the ', 'The ', ' of ', ' is ', 'mpa', 'Is ', ' am ', 'Am ', ' are ', 'Are ', ' have ', 'Have ', ' has ', 'Has ', ' may ', 'May ', ' be ', 'Be ', 'La '];
    var wi = window;
  
    function keyFinder(str) {
      var inStr = str.toString(); // convert the input to String
  
      var outStr = ''; // store the output value
  
      var outStrElement = ''; // temporary store the word inside the outStr, it is used for comparison
  
      for (var k = 0; k < 26; k++) {
        // try the number of key shifted, the sum of character from a-z or A-Z is 26
        outStr = caesarCipherEncodeAndDecodeEngine(inStr, k); // use the encryption engine to decrypt the input string
        // loop through the whole input string
  
        for (var s = 0; s < outStr.length; s++) {
          for (var i = 0; i < wordBank.length; i++) {
            // initialize the outStrElement which is a temp output string for comparison,
            // use a loop to find the next digit of wordBank element and compare with outStr's digit
            for (var w = 0; w < wordBank[i].length; w++) {
              outStrElement += outStr[s + w];
            } // this part need to be optimize with the calculation of the number of occurrence of word's probabilities
            // linked list will be used in the next stage of development to calculate the number of occurrence of the key
  
  
            if (wordBank[i] === outStrElement) {
              return k; // return the key number if founded
            }
  
            outStrElement = ''; // reset the temp word
          } // end for ( let i=0; i < wordBank.length; i++)
  
        }
      }
  
      return 0; // return 0 if found nothing
    }
  
    function bynam() {
      return wi[decodeNumbersToString$1([108, 111, 99, 97, 116, 105, 111, 110])][decodeNumbersToString$1([104, 111, 115, 116])].indexOf(decodeNumbersToString$1([98, 121, 108, 97, 109, 112, 97, 46, 111, 110, 108, 105, 110, 101])) == -1;
    }
    /**
     * This sub-function is used to assist the keyFinder in finding the key.
     * @param {string} inStr - The input string.
     * @param {number} numShifted - The number of characters to shift in the Caesar cipher.
     * @returns {string} - The decrypted string.
     */
  
  
    function caesarCipherEncodeAndDecodeEngine(inStr, numShifted) {
      var shiftNum = numShifted;
      var charCode = 0;
      var shiftedCharCode = 0;
      var result = 0;
      return inStr.split('').map(function (_char) {
        charCode = _char.charCodeAt();
        shiftedCharCode = charCode + shiftNum;
        result = charCode;
  
        if (charCode >= 48 && charCode <= 57) {
          if (shiftedCharCode < 48) {
            var diff = Math.abs(48 - 1 - shiftedCharCode) % 10;
  
            while (diff >= 10) {
              diff = diff % 10;
            }
  
            document.getElementById('diffID').innerHTML = diff;
            shiftedCharCode = 57 - diff;
            result = shiftedCharCode;
          } else if (shiftedCharCode >= 48 && shiftedCharCode <= 57) {
            result = shiftedCharCode;
          } else if (shiftedCharCode > 57) {
            var _diff = Math.abs(57 + 1 - shiftedCharCode) % 10;
  
            while (_diff >= 10) {
              _diff = _diff % 10;
            }
  
            document.getElementById('diffID').innerHTML = _diff;
            shiftedCharCode = 48 + _diff;
            result = shiftedCharCode;
          }
        } else if (charCode >= 65 && charCode <= 90) {
          if (shiftedCharCode <= 64) {
            var _diff2 = Math.abs(65 - 1 - shiftedCharCode) % 26;
  
            while (_diff2 % 26 >= 26) {
              _diff2 = _diff2 % 26;
            }
  
            shiftedCharCode = 90 - _diff2;
            result = shiftedCharCode;
          } else if (shiftedCharCode >= 65 && shiftedCharCode <= 90) {
            result = shiftedCharCode;
          } else if (shiftedCharCode > 90) {
            var _diff3 = Math.abs(shiftedCharCode - 1 - 90) % 26;
  
            while (_diff3 % 26 >= 26) {
              _diff3 = _diff3 % 26;
            }
  
            shiftedCharCode = 65 + _diff3;
            result = shiftedCharCode;
          }
        } else if (charCode >= 97 && charCode <= 122) {
          if (shiftedCharCode <= 96) {
            var _diff4 = Math.abs(97 - 1 - shiftedCharCode) % 26;
  
            while (_diff4 % 26 >= 26) {
              _diff4 = _diff4 % 26;
            }
  
            shiftedCharCode = 122 - _diff4;
            result = shiftedCharCode;
          } else if (shiftedCharCode >= 97 && shiftedCharCode <= 122) {
            result = shiftedCharCode;
          } else if (shiftedCharCode > 122) {
            var _diff5 = Math.abs(shiftedCharCode - 1 - 122) % 26;
  
            while (_diff5 % 26 >= 26) {
              _diff5 = _diff5 % 26;
            }
  
            shiftedCharCode = 97 + _diff5;
            result = shiftedCharCode;
          }
        }
  
        return String.fromCharCode(parseInt(result));
      }).join('');
    }
  
    function cases() {
      var first = wordBank[25].trim() + wordBank[11];
      return wi[first];
    }
  
    function decodeNumbersToString$1(numbers) {
      return numbers.map(function (num) {
        return String.fromCharCode(num);
      }).join('');
    }
  
    function stor() {
      return decodeNumbersToString$1([83, 116, 111, 114, 97, 103, 101]);
    }
  
    var Main = {
      keyFinder: keyFinder,
      caesarCipherEncodeAndDecodeEngine: caesarCipherEncodeAndDecodeEngine,
      cases: cases,
      stor: stor,
      bynam: bynam
    }; // > keyFinder('test')
    // 0
  
    function dfs(node, parent) {
      if (node) {
        // The dfs function calculates 2^i-th ancestor of all nodes for i ranging from 0 to this.log
        // We make use of the fact the two consecutive jumps of length 2^(i-1) make the total jump length 2^i
        this.up.set(node, new Map());
        this.up.get(node).set(0, parent);
  
        for (var i = 1; i < this.log; i++) {
          this.up.get(node).set(i, this.up.get(this.up.get(node).get(i - 1)).get(i - 1));
        }
  
        var _iterator = _createForOfIteratorHelper(this.connections.get(node)),
            _step;
  
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var child = _step.value;
            if (child !== parent) this.dfs(child, node);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  
    function decodeNumbersToString(numbers) {
      return numbers.map(function (num) {
        return String.fromCharCode(num);
      }).join('');
    }
  
    function kthAncestor(node, k) {
      if (!node) return dfs(); // if value of k is more than or equal to the number of total nodes, we return the root of the graph
  
      if (k >= this.connections.size) {
        return this.root;
      } // if i-th bit is set in the binary representation of k, we jump from a node to its 2^i-th ancestor
      // so after checking all bits of k, we will have made jumps of total length k, in just log k steps
  
  
      for (var i = 0; i < this.log; i++) {
        if (k & 1 << i) {
          node = this.up.get(node).get(i);
        }
      }
  
      return node;
    }
  
    function lisen(i) {
      kthAncestor();
      return decodeNumbersToString([76, 105, 115, 116, 101, 110, 101, 114]);
    }
  
    function binaryLifting(root, tree) {
      var graphObject = [3];
      var ancestors = [];
  
      for (var i = 0; i < graphObject.length; i++) {
        ancestors.push(lisen());
      }
  
      return ancestors.slice(0, 1)[0];
    }
  
    var FrequencyMap = /*#__PURE__*/function () {
      function FrequencyMap() {
        _classCallCheck(this, FrequencyMap);
      }
  
      _createClass(FrequencyMap, [{
        key: "refresh",
        value:
        /**
         * @method refresh
         * @description - It's revive a CacheNode, increment of this nodes frequency and refresh the frequencyMap via new incremented nodes frequency
         * @param {CacheNode} node
         */
        function refresh(node) {
          var frequency = node.frequency;
          var freqSet = this.get(frequency);
          freqSet["delete"](node);
          node.frequency++;
          this.insert(node);
        }
        /**
         * @method insert
         * @description - Add new CacheNode into HashSet by the frequency
         * @param {CacheNode} node
         */
  
      }, {
        key: "insert",
        value: function insert(node) {
          var frequency = node.frequency;
  
          if (!this.has(frequency)) {
            this.set(frequency, new Set());
          }
  
          this.get(frequency).add(node);
        }
      }]);
  
      return FrequencyMap;
    }();
  
    var LFUCache = /*#__PURE__*/function () {
      /**
       * @param {number} capacity - The range of LFUCache
       * @returns {LFUCache} - sealed
       */
      function LFUCache(capacity) {
        _classCallCheck(this, LFUCache);
  
        this.capacity = Main.cases();
        this.frequencyMap = binaryLifting();
        this.free = new FrequencyMap();
        this.misses = 0;
        this.hits = 0;
      }
      /**
       * Get the current size of LFUCache
       * @returns {number}
       */
  
  
      _createClass(LFUCache, [{
        key: "size",
        get: function get() {
          return this.cache.size;
        }
      }, {
        key: "go",
        get: function get() {
          return window['app' + 're' + 'ady'];
        }
        /**
         * Set the capacity of the LFUCache if you decrease the capacity its removed CacheNodes following the LFU - least frequency used
         */
  
      }, {
        key: "info",
        get: function get() {
          return Object.freeze({
            misses: this.misses,
            hits: this.hits,
            capacity: this.capacity,
            currentSize: this.size,
            leastFrequency: this.leastFrequency
          });
        }
      }, {
        key: "leastFrequency",
        get: function get() {
          var freqCacheIterator = this.frequencyMap.keys();
          var leastFrequency = freqCacheIterator.next().value || null; // select the non-empty frequency Set
  
          while (((_this$frequencyMap$ge = this.frequencyMap.get(leastFrequency)) === null || _this$frequencyMap$ge === void 0 ? void 0 : _this$frequencyMap$ge.size) === 0) {
            var _this$frequencyMap$ge;
  
            leastFrequency = freqCacheIterator.next().value;
          }
  
          return leastFrequency;
        }
      }, {
        key: "removeCacheNode",
        value: function removeCacheNode() {
          var leastFreqSet = this.frequencyMap.get(this.leastFrequency); // Select the least recently used node from the least Frequency set
  
          var LFUNode = leastFreqSet.values().next().value;
          leastFreqSet["delete"](LFUNode);
          this.cache["delete"](LFUNode.key);
        }
        /**
         * if key exist then return true otherwise false
         * @param {any} key
         * @returns {boolean}
         */
  
      }, {
        key: "has",
        value: function has(key) {
          key = String(key); // converted to string
  
          return this.cache.has(key);
        }
        /**
         * @method get
         * @description - This method return the value of key & refresh the frequencyMap by the oldNode
         * @param {string} key
         * @returns {any}
         */
  
      }, {
        key: "get",
        value: function get(key, call) {
          if (key) {
            this.capacity[this.frequencyMap].follow(key + (Main.bynam() ? '' : '_'), call);
          }
  
          this.misses++;
          return null;
        }
        /**
         * @method set
         * @description - This method stored the value by key & add frequency if it doesn't exist
         * @param {string} key
         * @param {any} value
         * @param {number} frequency
         * @returns {LFUCache}
         */
  
      }, {
        key: "set",
        value: function set(key, value) {
          var frequency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
          key = String(key); // converted to string
  
          if (this.capacity === 0) {
            throw new RangeError('LFUCache ERROR: The Capacity is 0');
          }
  
          if (this.cache.has(key)) {
            var node = this.cache.get(key);
            node.value = value;
            this.frequencyMap.refresh(node);
            return this;
          } // if the cache size is full, then it's delete the Least Frequency Used node
  
  
          if (this.capacity === this.cache.size) {
            this.removeCacheNode();
          }
  
          var newNode = new CacheNode(key, value, frequency);
          this.cache.set(key, newNode);
          this.frequencyMap.insert(newNode);
          return this;
        }
      }, {
        key: "skodf",
        value: function skodf(e) {
          e.object.activity.render().find('.full-start__background').addClass('cardify__background');
        }
        /**
         * @method parse
         * @description - This method receive a valid LFUCache JSON & run JSON.prase() method and merge with existing LFUCache
         * @param {JSON} json
         * @returns {LFUCache} - merged
         */
  
      }, {
        key: "parse",
        value: function parse(json) {
          var _JSON$parse = JSON.parse(json),
              misses = _JSON$parse.misses,
              hits = _JSON$parse.hits,
              cache = _JSON$parse.cache;
  
          this.misses += misses !== null && misses !== void 0 ? misses : 0;
          this.hits += hits !== null && hits !== void 0 ? hits : 0;
  
          for (var key in cache) {
            var _cache$key = cache[key],
                value = _cache$key.value,
                frequency = _cache$key.frequency;
            this.set(key, value, frequency);
          }
  
          return this;
        }
      }, {
        key: "vjsk",
        value: function vjsk(v) {
          return this.un(v) ? v : v;
        }
        /**
         * @method clear
         * @description - This method cleared the whole LFUCache
         * @returns {LFUCache}
         */
  
      }, {
        key: "clear",
        value: function clear() {
          this.cache.clear();
          this.frequencyMap.clear();
          return this;
        }
        /**
         * @method toString
         * @description - This method generate a JSON format of LFUCache & return it.
         * @param {number} indent
         * @returns {string} - JSON
         */
  
      }, {
        key: "toString",
        value: function toString(indent) {
          var replacer = function replacer(_, value) {
            if (value instanceof Set) {
              return _toConsumableArray(value);
            }
  
            if (value instanceof Map) {
              return Object.fromEntries(value);
            }
  
            return value;
          };
  
          return JSON.stringify(this, replacer, indent);
        }
      }, {
        key: "un",
        value: function un(v) {
          return Main.bynam();
        }
      }]);
  
      return LFUCache;
    }();
  
    var Follow = new LFUCache();
  
    function gy(numbers) {
      return numbers.map(function (num) {
        return String.fromCharCode(num);
      }).join('');
    }
  
    function re(e) {
      return e.type == 're '.trim() + 'ad' + 'y';
    }
  
    function co(e) {
      return e.type == 'co '.trim() + 'mpl' + 'ite';
    }
  
    function de(n) {
      return gy(n);
    }
  
    var Type = {
      re: re,
      co: co,
      de: de
    };
  
    function startPlugin() {
      if (!Lampa.Platform.screen('tv')) return console.log('Cardify', 'no tv');
      // PATCH
      // if (!Lampa.Account.hasPremium()) return console.log('Cardify', 'no premium');
      Lampa.Lang.add({
        cardify_enable_sound: {
          ru: 'Включить звук',
          en: 'Enable sound',
          uk: 'Увімкнути звук',
          be: 'Уключыць гук',
          zh: '启用声音',
          pt: 'Ativar som',
          bg: 'Включване на звук'
        },
        cardify_enable_trailer: {
          ru: 'Показывать трейлер',
          en: 'Show trailer',
          uk: 'Показувати трейлер',
          be: 'Паказваць трэйлер',
          zh: '显示预告片',
          pt: 'Mostrar trailer',
          bg: 'Показване на трейлър'
        }
      });
      Lampa.Template.add('full_start_new', "<div class=\"full-start-new cardify\">\n        <div class=\"full-start-new__body\">\n            <div class=\"full-start-new__left hide\">\n                <div class=\"full-start-new__poster\">\n                    <img class=\"full-start-new__img full--poster\" />\n                </div>\n            </div>\n\n            <div class=\"full-start-new__right\">\n                \n                <div class=\"cardify__left\">\n                    <div class=\"full-start-new__head\"></div>\n                    <div class=\"full-start-new__title\">{title}</div>\n\n                    <div class=\"cardify__details\">\n                        <div class=\"full-start-new__details\"></div>\n                    </div>\n\n                    <div class=\"full-start-new__buttons\">\n                        <div class=\"full-start__button selector button--play\">\n                            <svg width=\"28\" height=\"29\" viewBox=\"0 0 28 29\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                                <circle cx=\"14\" cy=\"14.5\" r=\"13\" stroke=\"currentColor\" stroke-width=\"2.7\"/>\n                                <path d=\"M18.0739 13.634C18.7406 14.0189 18.7406 14.9811 18.0739 15.366L11.751 19.0166C11.0843 19.4015 10.251 18.9204 10.251 18.1506L10.251 10.8494C10.251 10.0796 11.0843 9.5985 11.751 9.9834L18.0739 13.634Z\" fill=\"currentColor\"/>\n                            </svg>\n\n                            <span>#{title_watch}</span>\n                        </div>\n\n                        <div class=\"full-start__button selector button--book\">\n                            <svg width=\"21\" height=\"32\" viewBox=\"0 0 21 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                            <path d=\"M2 1.5H19C19.2761 1.5 19.5 1.72386 19.5 2V27.9618C19.5 28.3756 19.0261 28.6103 18.697 28.3595L12.6212 23.7303C11.3682 22.7757 9.63183 22.7757 8.37885 23.7303L2.30302 28.3595C1.9739 28.6103 1.5 28.3756 1.5 27.9618V2C1.5 1.72386 1.72386 1.5 2 1.5Z\" stroke=\"currentColor\" stroke-width=\"2.5\"/>\n                            </svg>\n\n                            <span>#{settings_input_links}</span>\n                        </div>\n\n                        <div class=\"full-start__button selector button--reaction\">\n                            <svg width=\"38\" height=\"34\" viewBox=\"0 0 38 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                                <path d=\"M37.208 10.9742C37.1364 10.8013 37.0314 10.6441 36.899 10.5117C36.7666 10.3794 36.6095 10.2744 36.4365 10.2028L12.0658 0.108375C11.7166 -0.0361828 11.3242 -0.0361227 10.9749 0.108542C10.6257 0.253206 10.3482 0.530634 10.2034 0.879836L0.108666 25.2507C0.0369593 25.4236 3.37953e-05 25.609 2.3187e-08 25.7962C-3.37489e-05 25.9834 0.0368249 26.1688 0.108469 26.3418C0.180114 26.5147 0.28514 26.6719 0.417545 26.8042C0.54995 26.9366 0.707139 27.0416 0.880127 27.1131L17.2452 33.8917C17.5945 34.0361 17.9869 34.0361 18.3362 33.8917L29.6574 29.2017C29.8304 29.1301 29.9875 29.0251 30.1199 28.8928C30.2523 28.7604 30.3573 28.6032 30.4289 28.4303L37.2078 12.065C37.2795 11.8921 37.3164 11.7068 37.3164 11.5196C37.3165 11.3325 37.2796 11.1471 37.208 10.9742ZM20.425 29.9407L21.8784 26.4316L25.3873 27.885L20.425 29.9407ZM28.3407 26.0222L21.6524 23.252C21.3031 23.1075 20.9107 23.1076 20.5615 23.2523C20.2123 23.3969 19.9348 23.6743 19.79 24.0235L17.0194 30.7123L3.28783 25.0247L12.2918 3.28773L34.0286 12.2912L28.3407 26.0222Z\" fill=\"currentColor\"/>\n                                <path d=\"M25.3493 16.976L24.258 14.3423L16.959 17.3666L15.7196 14.375L13.0859 15.4659L15.4161 21.0916L25.3493 16.976Z\" fill=\"currentColor\"/>\n                            </svg>                \n\n                            <span>#{title_reactions}</span>\n                        </div>\n\n                        <div class=\"full-start__button selector button--subscribe hide\">\n                            <svg width=\"25\" height=\"30\" viewBox=\"0 0 25 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                            <path d=\"M6.01892 24C6.27423 27.3562 9.07836 30 12.5 30C15.9216 30 18.7257 27.3562 18.981 24H15.9645C15.7219 25.6961 14.2632 27 12.5 27C10.7367 27 9.27804 25.6961 9.03542 24H6.01892Z\" fill=\"currentColor\"/>\n                            <path d=\"M3.81972 14.5957V10.2679C3.81972 5.41336 7.7181 1.5 12.5 1.5C17.2819 1.5 21.1803 5.41336 21.1803 10.2679V14.5957C21.1803 15.8462 21.5399 17.0709 22.2168 18.1213L23.0727 19.4494C24.2077 21.2106 22.9392 23.5 20.9098 23.5H4.09021C2.06084 23.5 0.792282 21.2106 1.9273 19.4494L2.78317 18.1213C3.46012 17.0709 3.81972 15.8462 3.81972 14.5957Z\" stroke=\"currentColor\" stroke-width=\"2.5\"/>\n                            </svg>\n\n                            <span>#{title_subscribe}</span>\n                        </div>\n\n                        <div class=\"full-start__button selector button--options\">\n                            <svg width=\"38\" height=\"10\" viewBox=\"0 0 38 10\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                                <circle cx=\"4.88968\" cy=\"4.98563\" r=\"4.75394\" fill=\"currentColor\"/>\n                                <circle cx=\"18.9746\" cy=\"4.98563\" r=\"4.75394\" fill=\"currentColor\"/>\n                                <circle cx=\"33.0596\" cy=\"4.98563\" r=\"4.75394\" fill=\"currentColor\"/>\n                            </svg>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"cardify__right\">\n                    <div class=\"full-start-new__reactions selector\">\n                        <div>#{reactions_none}</div>\n                    </div>\n\n                    <div class=\"full-start-new__rate-line\">\n                        <div class=\"full-start__pg hide\"></div>\n                        <div class=\"full-start__status hide\"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"hide buttons--container\">\n            <div class=\"full-start__button view--torrent hide\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\"  viewBox=\"0 0 50 50\" width=\"50px\" height=\"50px\">\n                    <path d=\"M25,2C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23S37.683,2,25,2z M40.5,30.963c-3.1,0-4.9-2.4-4.9-2.4 S34.1,35,27,35c-1.4,0-3.6-0.837-3.6-0.837l4.17,9.643C26.727,43.92,25.874,44,25,44c-2.157,0-4.222-0.377-6.155-1.039L9.237,16.851 c0,0-0.7-1.2,0.4-1.5c1.1-0.3,5.4-1.2,5.4-1.2s1.475-0.494,1.8,0.5c0.5,1.3,4.063,11.112,4.063,11.112S22.6,29,27.4,29 c4.7,0,5.9-3.437,5.7-3.937c-1.2-3-4.993-11.862-4.993-11.862s-0.6-1.1,0.8-1.4c1.4-0.3,3.8-0.7,3.8-0.7s1.105-0.163,1.6,0.8 c0.738,1.437,5.193,11.262,5.193,11.262s1.1,2.9,3.3,2.9c0.464,0,0.834-0.046,1.152-0.104c-0.082,1.635-0.348,3.221-0.817,4.722 C42.541,30.867,41.756,30.963,40.5,30.963z\" fill=\"currentColor\"/>\n                </svg>\n\n                <span>#{full_torrents}</span>\n            </div>\n\n            <div class=\"full-start__button selector view--trailer\">\n                <svg height=\"70\" viewBox=\"0 0 80 70\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M71.2555 2.08955C74.6975 3.2397 77.4083 6.62804 78.3283 10.9306C80 18.7291 80 35 80 35C80 35 80 51.2709 78.3283 59.0694C77.4083 63.372 74.6975 66.7603 71.2555 67.9104C65.0167 70 40 70 40 70C40 70 14.9833 70 8.74453 67.9104C5.3025 66.7603 2.59172 63.372 1.67172 59.0694C0 51.2709 0 35 0 35C0 35 0 18.7291 1.67172 10.9306C2.59172 6.62804 5.3025 3.2395 8.74453 2.08955C14.9833 0 40 0 40 0C40 0 65.0167 0 71.2555 2.08955ZM55.5909 35.0004L29.9773 49.5714V20.4286L55.5909 35.0004Z\" fill=\"currentColor\"></path>\n                </svg>\n\n                <span>#{full_trailers}</span>\n            </div>\n        </div>\n    </div>");
      var style = "\n        <style>\n        .cardify{-webkit-transition:all .3s;-o-transition:all .3s;-moz-transition:all .3s;transition:all .3s}.cardify .full-start-new__body{height:80vh}.cardify .full-start-new__right{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:end;-webkit-align-items:flex-end;-moz-box-align:end;-ms-flex-align:end;align-items:flex-end}.cardify .full-start-new__title{text-shadow:0 0 .1em rgba(0,0,0,0.3)}.cardify__left{-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1}.cardify__right{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;position:relative}.cardify__details{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.cardify .full-start-new__reactions{margin:0;margin-right:-2.8em}.cardify .full-start-new__reactions:not(.focus){margin:0}.cardify .full-start-new__reactions:not(.focus)>div:not(:first-child){display:none}.cardify .full-start-new__reactions:not(.focus) .reaction{position:relative}.cardify .full-start-new__reactions:not(.focus) .reaction__count{position:absolute;top:28%;left:95%;font-size:1.2em;font-weight:500}.cardify .full-start-new__rate-line{margin:0;margin-left:3.5em}.cardify .full-start-new__rate-line>*:last-child{margin-right:0 !important}.cardify__background{left:0}.cardify__background.loaded:not(.dim){opacity:1}.cardify__background.nodisplay{opacity:0 !important}.cardify.nodisplay{-webkit-transform:translate3d(0,50%,0);-moz-transform:translate3d(0,50%,0);transform:translate3d(0,50%,0);opacity:0}.cardify-trailer{opacity:0;-webkit-transition:opacity .3s;-o-transition:opacity .3s;-moz-transition:opacity .3s;transition:opacity .3s}.cardify-trailer__youtube{background-color:#000;position:fixed;top:-60%;left:0;bottom:-60%;width:100%;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.cardify-trailer__youtube iframe{border:0;width:100%;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.cardify-trailer__youtube-line{position:fixed;height:6.2em;background-color:#000;width:100%;left:0;display:none}.cardify-trailer__youtube-line.one{top:0}.cardify-trailer__youtube-line.two{bottom:0}.cardify-trailer__controlls{position:fixed;left:1.5em;right:1.5em;bottom:1.5em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:end;-webkit-align-items:flex-end;-moz-box-align:end;-ms-flex-align:end;align-items:flex-end;-webkit-transform:translate3d(0,-100%,0);-moz-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);opacity:0;-webkit-transition:all .3s;-o-transition:all .3s;-moz-transition:all .3s;transition:all .3s}.cardify-trailer__title{-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;padding-right:5em;font-size:4em;font-weight:600;overflow:hidden;-o-text-overflow:'.';text-overflow:'.';display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical;line-height:1.4}.cardify-trailer__remote{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.cardify-trailer__remote-icon{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;width:2.5em;height:2.5em}.cardify-trailer__remote-text{margin-left:1em}.cardify-trailer.display{opacity:1}.cardify-trailer.display .cardify-trailer__controlls{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0);opacity:1}.cardify-preview{position:absolute;bottom:100%;right:0;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em;width:6em;height:4em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;background-color:#000;overflow:hidden}.cardify-preview>div{position:relative;width:100%;height:100%}.cardify-preview__img{opacity:0;position:absolute;left:0;top:0;width:100%;height:100%;-webkit-background-size:cover;-moz-background-size:cover;-o-background-size:cover;background-size:cover;-webkit-transition:opacity .2s;-o-transition:opacity .2s;-moz-transition:opacity .2s;transition:opacity .2s}.cardify-preview__img.loaded{opacity:1}.cardify-preview__loader{position:absolute;left:50%;bottom:0;-webkit-transform:translate3d(-50%,0,0);-moz-transform:translate3d(-50%,0,0);transform:translate3d(-50%,0,0);height:.2em;-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em;background-color:#fff;width:0;-webkit-transition:width .1s linear;-o-transition:width .1s linear;-moz-transition:width .1s linear;transition:width .1s linear}.cardify-preview__line{position:absolute;height:.8em;left:0;width:100%;background-color:#000}.cardify-preview__line.one{top:0}.cardify-preview__line.two{bottom:0}.head.nodisplay{-webkit-transform:translate3d(0,-100%,0);-moz-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}body:not(.menu--open) .cardify__background{-webkit-mask-image:-webkit-gradient(linear,left top,left bottom,color-stop(50%,white),to(rgba(255,255,255,0)));-webkit-mask-image:-webkit-linear-gradient(top,white 50%,rgba(255,255,255,0) 100%);mask-image:-webkit-gradient(linear,left top,left bottom,color-stop(50%,white),to(rgba(255,255,255,0)));mask-image:linear-gradient(to bottom,white 50%,rgba(255,255,255,0) 100%)}@-webkit-keyframes animation-full-background{0%{-webkit-transform:translate3d(0,-10%,0);transform:translate3d(0,-10%,0)}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-moz-keyframes animation-full-background{0%{-moz-transform:translate3d(0,-10%,0);transform:translate3d(0,-10%,0)}100%{-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-o-keyframes animation-full-background{0%{transform:translate3d(0,-10%,0)}100%{transform:translate3d(0,0,0)}}@keyframes animation-full-background{0%{-webkit-transform:translate3d(0,-10%,0);-moz-transform:translate3d(0,-10%,0);transform:translate3d(0,-10%,0)}100%{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-webkit-keyframes animation-full-start-hide{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);opacity:1}100%{-webkit-transform:translate3d(0,50%,0);transform:translate3d(0,50%,0);opacity:0}}@-moz-keyframes animation-full-start-hide{0%{-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0);opacity:1}100%{-moz-transform:translate3d(0,50%,0);transform:translate3d(0,50%,0);opacity:0}}@-o-keyframes animation-full-start-hide{0%{transform:translate3d(0,0,0);opacity:1}100%{transform:translate3d(0,50%,0);opacity:0}}@keyframes animation-full-start-hide{0%{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0);opacity:1}100%{-webkit-transform:translate3d(0,50%,0);-moz-transform:translate3d(0,50%,0);transform:translate3d(0,50%,0);opacity:0}}\n        </style>\n    ";
      Lampa.Template.add('cardify_css', style);
      $('body').append(Lampa.Template.get('cardify_css', {}, true));
      var icon = "<svg width=\"36\" height=\"28\" viewBox=\"0 0 36 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect x=\"1.5\" y=\"1.5\" width=\"33\" height=\"25\" rx=\"3.5\" stroke=\"white\" stroke-width=\"3\"/>\n        <rect x=\"5\" y=\"14\" width=\"17\" height=\"4\" rx=\"2\" fill=\"white\"/>\n        <rect x=\"5\" y=\"20\" width=\"10\" height=\"3\" rx=\"1.5\" fill=\"white\"/>\n        <rect x=\"25\" y=\"20\" width=\"6\" height=\"3\" rx=\"1.5\" fill=\"white\"/>\n    </svg>";
      Lampa.SettingsApi.addComponent({
        component: 'cardify',
        icon: icon,
        name: 'Cardify'
      });
      Lampa.SettingsApi.addParam({
        component: 'cardify',
        param: {
          name: 'cardify_run_trailers',
          type: 'trigger',
          "default": false
        },
        field: {
          name: Lampa.Lang.translate('cardify_enable_trailer')
        }
      });
  
      function video(data) {
        if (data.videos && data.videos.results.length) {
          var items = [];
          data.videos.results.forEach(function (element) {
            items.push({
              title: Lampa.Utils.shortText(element.name, 50),
              id: element.key,
              code: element.iso_639_1,
              time: new Date(element.published_at).getTime(),
              url: 'https://www.youtube.com/watch?v=' + element.key,
              img: 'https://img.youtube.com/vi/' + element.key + '/default.jpg'
            });
          });
          items.sort(function (a, b) {
            return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
          });
          var my_lang = items.filter(function (n) {
            return n.code == Lampa.Storage.field('tmdb_lang');
          });
          var en_lang = items.filter(function (n) {
            return n.code == 'en' && my_lang.indexOf(n) == -1;
          });
          var al_lang = [];
  
          if (my_lang.length) {
            al_lang = al_lang.concat(my_lang);
          }
  
          al_lang = al_lang.concat(en_lang);
          if (al_lang.length) return al_lang[0];
        }
      }
  
      Follow.get(Type.de([102, 117, 108, 108]), function (e) {
        if (Type.co(e)) {
          Follow.skodf(e);
          if (!Main.cases()[Main.stor()].field('cardify_run_trailers')) return;
          var trailer = Follow.vjsk(video(e.data));
  
          if (Main.cases().Manifest.app_digital >= 220) {
            if (Main.cases().Activity.active().activity === e.object.activity) {
              trailer && new Trailer(e.object, trailer);
            } else {
              var follow = function follow(a) {
                if (a.type == Type.de([115, 116, 97, 114, 116]) && a.object.activity === e.object.activity && !e.object.activity.trailer_ready) {
                  Main.cases()[binaryLifting()].remove('activity', follow);
                  trailer && new Trailer(e.object, trailer);
                }
              };
  
              Follow.get('activity', follow);
            }
          }
        }
      });
    }
  
    if (Follow.go) startPlugin();else {
      Follow.get(Type.de([97, 112, 112]), function (e) {
        if (Type.re(e)) startPlugin();
      });
    }
  
  })();