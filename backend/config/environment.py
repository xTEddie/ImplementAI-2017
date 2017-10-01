ENVIRONMENT = 'dev'
# ENVIRONMENT = 'prod'

# SETTINGS_MODULE = 'backend.config.settings.dev'
SETTINGS_MODULE = 'config.settings'

if ENVIRONMENT == 'prod':
    SETTINGS_MODULE = 'backend.config.settings.prod'
