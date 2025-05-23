BEGIN
    execute immediate 'ALTER TABLE IDN_OAUTH2_DEVICE_FLOW ADD QUANTIFIER INTEGER DEFAULT 0 NOT NULL';
    execute immediate 'ALTER TABLE IDN_OAUTH2_DEVICE_FLOW ADD CONSTRAINT USRCDE_QNTFR_CONSTRAINT UNIQUE (USER_CODE, QUANTIFIER)';
    execute immediate 'ALTER TABLE IDN_OAUTH2_DEVICE_FLOW DROP CONSTRAINT USER_CODE';
    dbms_output.put_line('created');
exception WHEN OTHERS THEN
    dbms_output.put_line('skipped');
END;
/

UPDATE IDP_METADATA SET NAME = 'account.lock.handler.lock.on.max.failed.attempts.enable'
WHERE NAME = 'account.lock.handler.enable'
/

CREATE TABLE IDN_SECRET_TYPE (
    ID VARCHAR2(255) NOT NULL,
    NAME VARCHAR2(255) NOT NULL,
    DESCRIPTION VARCHAR2(1023) NULL,
    PRIMARY KEY (ID),
    CONSTRAINT SECRET_TYPE_NAME_CONSTRAINT UNIQUE (NAME)
)
/

CREATE TABLE IDN_SECRET (
    ID VARCHAR2(255) NOT NULL,
    TENANT_ID NUMBER(22,0) NOT NULL,
    SECRET_NAME VARCHAR2(255) NOT NULL,
    SECRET_VALUE VARCHAR(4000) NOT NULL,
    CREATED_TIME TIMESTAMP NOT NULL,
    LAST_MODIFIED TIMESTAMP NOT NULL,
    TYPE_ID VARCHAR2(255) NOT NULL,
    DESCRIPTION VARCHAR2(1023) NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (TYPE_ID) REFERENCES IDN_SECRET_TYPE(ID) ON DELETE CASCADE,
    UNIQUE (SECRET_NAME, TENANT_ID, TYPE_ID)
)
/

INSERT INTO IDN_SECRET_TYPE (ID, NAME, DESCRIPTION) VALUES
('1358bdbf-e0cc-4268-a42c-c3e0960e13f0', 'ADAPTIVE_AUTH_CALL_CHOREO', 'Secret type to uniquely identify secrets relevant to callChoreo adaptive auth function')
/

INSERT INTO IDN_CONFIG_TYPE (ID, NAME, DESCRIPTION)
SELECT '669b99ca-cdb0-44a6-8cae-babed3b585df', 'Publisher', 'A resource type to keep the event publisher configurations' FROM DUAL
WHERE NOT EXISTS (SELECT * FROM IDN_CONFIG_TYPE WHERE id = '669b99ca-cdb0-44a6-8cae-babed3b585df' OR name = 'Publisher')
/

INSERT INTO IDN_CONFIG_TYPE (ID, NAME, DESCRIPTION) VALUES
('73f6d9ca-62f4-4566-bab9-2a930ae51ba8', 'BRANDING_PREFERENCES', 'A resource type to keep the tenant branding preferences')
/

INSERT INTO IDN_CONFIG_TYPE (ID, NAME, DESCRIPTION) VALUES
('899c69b2-8bf7-46b5-9666-f7f99f90d6cc', 'fido-config', 'A resource type to store FIDO authenticator related preferences')
/

