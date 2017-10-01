ENVIRONMENT = 'dev'
# ENVIRONMENT = 'prod'

# SETTINGS_MODULE = 'backend.config.settings.dev'
SETTINGS_MODULE = 'config.settings.base'

if ENVIRONMENT == 'prod':
    SETTINGS_MODULE = 'backend.config.settings.prod'
