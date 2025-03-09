(function () {
    'use strict';

    const localhost = "/lampac-api";
    const syncInterval = 10000; // 10 seconds
    const syncIncludeKeys = [
        // 'account',
        'favorite',
        'online_watched_last',
        'menu_hide',
        'menu_sort',
        'noskaz2',
        'plugins',
        'iptv_favorite_channels',
        'iptv_play_history_main_boardsk',
    ]

    function getAccountUrl(path) {
        const email = Lampa.Storage.get('account_email');
        if (!email) return null;
        return `${localhost}/storage/${path}?path=backup&account_email=${encodeURIComponent(email)}`;
    }

    const Backup = {
        export: function () {
            const url = getAccountUrl('set');
            if (!url) {
                Lampa.Stack.log('No email set, skipping export');
                return;
            }

            const data = {};
            for (let key in localStorage) {
                if (syncIncludeKeys.includes(key)) {
                    data[key] = localStorage[key];
                }
            }

            $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (response) {
                    if (response.success) {
                        Lampa.Stack.log('Export successful');
                    } else {
                        Lampa.Stack.log('Export failed:', response);
                    }
                },
                error: function (error) {
                    Lampa.Stack.log('Export error:', error);
                },
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
                Lampa.Stack.log('No email set, skipping import');
                return Promise.reject('No email set');
            }

            return new Promise((resolve, reject) => {
                $.ajax({
                    url: url,
                    type: 'GET',
                    success: function (response) {
                        if (response.data) {
                            const data = JSON.parse(response.data);

                            for (let key in data) {
                                if (!syncIncludeKeys.includes(key)) {
                                    continue;
                                }
                                try {
                                    let existingValue = localStorage.getItem(key);
                                    let incomingValue = data[key];

                                    // Try to parse JSON values
                                    try { existingValue = JSON.parse(existingValue); } catch (e) { }
                                    try { incomingValue = JSON.parse(incomingValue); } catch (e) { }

                                    // Merge values based on their types
                                    let mergedValue;
                                    if (typeof existingValue === 'object' && existingValue !== null && 
                                        typeof incomingValue === 'object' && incomingValue !== null) {
                                        console.log('cloneDeep', key, existingValue, incomingValue);
                                        mergedValue = merge(existingValue, incomingValue);
                                    } else {
                                        // For primitive types, use force flag to determine priority
                                        mergedValue = options.force ? incomingValue : existingValue;
                                    }

                                    // Store the result back
                                    localStorage.setItem(key,
                                        typeof mergedValue === 'object' ?
                                            JSON.stringify(mergedValue) :
                                            mergedValue
                                    );
                                } catch (e) {
                                    Lampa.Stack.log('Error merging key:', key, e);
                                    // On error, fallback to simple override based on force flag
                                    if (options.force) {
                                        localStorage.setItem(key, data[key]);
                                    }
                                }
                            }
                            Lampa.Stack.log('Import successful');

                            if (options.initial) {
                                window.lampa_stack_initial_sync = true;
                            }
                            
                            resolve(response);
                        } else {
                            resolve(null);
                        }
                    },
                    error: function (error) {
                        console.log('[Backup] Import error:', error);
                        reject(error);
                    },
                });
            });
        },

        startAutoSync: function () {
            // Set up interval for continuous sync
            setInterval(() => {
                this.import().then(() => {
                    this.export();
                });
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

    Lampa.Stack.Backup = Backup;

    if (!document.querySelector('script[src*="lodash.merge"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/lodash.merge@4.6.2/index.min.js';
      document.head.appendChild(script);
      Lampa.Stack.log('Added lodash.merge script to head');
    } else {
      Lampa.Stack.log('lodash.merge script already exists');
    }

    if (!window.lampa_stack_initial_sync) {
        Backup.import({ force: true, initial: true });
        // ONLY MANUAL FOR NOW. IDFK HOW THIS WILL WORK, TOO JANKY
        // Backup.startAutoSync();
    }

})();
