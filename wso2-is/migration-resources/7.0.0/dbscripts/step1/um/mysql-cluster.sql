CREATE INDEX INDEX_UM_TENANT_ORG_UUID ON UM_TENANT(UM_ORG_UUID);

CREATE INDEX INDEX_ROLE_PERMSN_TI_RN ON UM_ROLE_PERMISSION(UM_TENANT_ID,UM_ROLE_NAME);

CREATE TABLE IF NOT EXISTS UM_ORG_DISCOVERY (
            UM_ID INTEGER NOT NULL AUTO_INCREMENT,
            UM_ORG_ID VARCHAR(36) NOT NULL,
            UM_ROOT_ORG_ID VARCHAR(36) NOT NULL,
            UM_DISCOVERY_TYPE VARCHAR(255) NOT NULL,
            UM_DISCOVERY_VALUE VARCHAR(255) NOT NULL,
            PRIMARY KEY (UM_ID),
            UNIQUE (UM_ROOT_ORG_ID, UM_DISCOVERY_TYPE, UM_DISCOVERY_VALUE),
            FOREIGN KEY (UM_ROOT_ORG_ID) REFERENCES UM_ORG(UM_ID) ON DELETE CASCADE,
            FOREIGN KEY (UM_ORG_ID) REFERENCES UM_ORG(UM_ID) ON DELETE CASCADE
)ENGINE NDB;

ALTER TABLE UM_ORG_ROLE_USER ADD COLUMN UM_USER_RESIDENT_ORG_ID VARCHAR(36);

ALTER TABLE UM_ROLE
    ADD COLUMN UM_ROLE_UUID VARCHAR(255) NOT NULL DEFAULT -1,
    ADD COLUMN UM_CREATED_TIME TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN UM_LAST_MODIFIED TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS UM_ORG_USER_ASSOCIATION(
    UM_USER_ID VARCHAR(255) NOT NULL,
    UM_ORG_ID VARCHAR(36) NOT NULL,
    UM_ASSOCIATED_USER_ID VARCHAR(255) NOT NULL,
    UM_ASSOCIATED_ORG_ID VARCHAR(36) NOT NULL,
    PRIMARY KEY (UM_USER_ID, UM_ORG_ID, UM_ASSOCIATED_USER_ID, UM_ASSOCIATED_ORG_ID)
)ENGINE NDB;

CREATE TABLE IF NOT EXISTS UM_HYBRID_ROLE_AUDIENCE(
            UM_ID INTEGER NOT NULL AUTO_INCREMENT,
            UM_AUDIENCE VARCHAR(255) NOT NULL,
            UM_AUDIENCE_ID VARCHAR(255) NOT NULL,
            UNIQUE (UM_AUDIENCE, UM_AUDIENCE_ID),
            PRIMARY KEY (UM_ID)
)ENGINE NDB;

ALTER TABLE UM_HYBRID_ROLE
	ADD COLUMN UM_AUDIENCE_REF_ID INTEGER DEFAULT -1 NOT NULL,
    ADD COLUMN UM_UUID VARCHAR(36),
	DROP INDEX UM_ROLE_NAME,
	ADD CONSTRAINT UM_AUDIENCE_REF_ID UNIQUE (UM_ROLE_NAME, UM_TENANT_ID, UM_AUDIENCE_REF_ID);

CREATE TABLE IF NOT EXISTS UM_IDP_GROUP_ROLE(
            UM_ROLE_ID INTEGER NOT NULL,
            UM_GROUP_ID VARCHAR(36) NOT NULL,
            UM_TENANT_ID INTEGER NOT NULL,
            PRIMARY KEY (UM_ROLE_ID, UM_GROUP_ID, UM_TENANT_ID),
            FOREIGN KEY (UM_ROLE_ID, UM_TENANT_ID) REFERENCES UM_HYBRID_ROLE(UM_ID, UM_TENANT_ID) ON DELETE CASCADE
)ENGINE NDB;

CREATE TABLE IF NOT EXISTS UM_SHARED_ROLE(
            UM_ID INTEGER NOT NULL AUTO_INCREMENT,
            UM_SHARED_ROLE_ID INTEGER NOT NULL,
            UM_MAIN_ROLE_ID INTEGER NOT NULL,
            UM_SHARED_ROLE_TENANT_ID INTEGER NOT NULL,
            UM_MAIN_ROLE_TENANT_ID INTEGER NOT NULL,
            PRIMARY KEY (UM_ID),
            UNIQUE (UM_SHARED_ROLE_ID, UM_MAIN_ROLE_ID, UM_MAIN_ROLE_TENANT_ID),
            FOREIGN KEY (UM_SHARED_ROLE_ID, UM_SHARED_ROLE_TENANT_ID) REFERENCES UM_HYBRID_ROLE(UM_ID, UM_TENANT_ID) ON DELETE CASCADE,
            FOREIGN KEY (UM_MAIN_ROLE_ID, UM_MAIN_ROLE_TENANT_ID) REFERENCES UM_HYBRID_ROLE(UM_ID, UM_TENANT_ID) ON DELETE CASCADE
)ENGINE NDB;
