CREATE TABLE IF NOT EXISTS FIDO2_DEVICE_STORE (
  TENANT_ID INTEGER,
  DOMAIN_NAME VARCHAR(255) NOT NULL,
  USER_NAME VARCHAR(45) NOT NULL,
  TIME_REGISTERED TIMESTAMP,
  USER_HANDLE VARCHAR(64) NOT NULL,
  CREDENTIAL_ID VARCHAR(200) NOT NULL,
  PUBLIC_KEY_COSE VARCHAR(1024) NOT NULL,
  SIGNATURE_COUNT BIGINT,
  USER_IDENTITY VARCHAR(512) NOT NULL,
  PRIMARY KEY (CREDENTIAL_ID, USER_HANDLE)
);

CREATE TABLE IF NOT EXISTS IDN_AUTH_SESSION_APP_INFO (
  SESSION_ID VARCHAR (100) NOT NULL,
  SUBJECT VARCHAR (100) NOT NULL,
  APP_ID INTEGER NOT NULL,
  INBOUND_AUTH_TYPE VARCHAR (255) NOT NULL,
  PRIMARY KEY (SESSION_ID, SUBJECT, APP_ID, INBOUND_AUTH_TYPE)
);

CREATE TABLE IF NOT EXISTS IDN_AUTH_SESSION_META_DATA (
  SESSION_ID VARCHAR (100) NOT NULL,
  PROPERTY_TYPE VARCHAR (100) NOT NULL,
  VALUE VARCHAR (255) NOT NULL,
  PRIMARY KEY (SESSION_ID, PROPERTY_TYPE, VALUE)
);

CREATE TABLE IF NOT EXISTS IDN_FUNCTION_LIBRARY (
	NAME VARCHAR(255) NOT NULL,
	DESCRIPTION VARCHAR(1023),
	TYPE VARCHAR(255) NOT NULL,
	TENANT_ID INTEGER NOT NULL,
	DATA BLOB NOT NULL,
	PRIMARY KEY (TENANT_ID,NAME)
);

DROP PROCEDURE IF EXISTS skip_index_if_exists;

CREATE PROCEDURE skip_index_if_exists(indexName varchar(64), tableName varchar(64), tableColumns varchar(255)) BEGIN BEGIN DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN END; SET @s = CONCAT('CREATE INDEX ', indexName, ' ON ', tableName, tableColumns); PREPARE stmt FROM @s; EXECUTE stmt; END;END;

CALL skip_index_if_exists('IDX_FIDO2_STR','FIDO2_DEVICE_STORE','(USER_NAME, TENANT_ID, DOMAIN_NAME, CREDENTIAL_ID, USER_HANDLE)');

DROP PROCEDURE IF EXISTS skip_index_if_exists;

DROP PROCEDURE IF EXISTS ALTER_UM_HYBRID_ROLE_UM_ROLE_NAME_INDEX;

DELIMITER $$
CREATE PROCEDURE ALTER_UM_HYBRID_ROLE_UM_ROLE_NAME_INDEX()
BEGIN
    DECLARE alter_sql TEXT;
    DECLARE index_exists INT DEFAULT 0;

    -- Check if the index exists
    SELECT COUNT(*) INTO index_exists
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
    AND table_name = 'UM_HYBRID_ROLE'
    AND index_name = 'UM_ROLE_NAME';

    -- Construct the SQL based on the existence of the index
    IF index_exists = 0 THEN
        PREPARE stmt FROM 'ALTER TABLE UM_HYBRID_ROLE ADD CONSTRAINT UNIQUE (UM_ROLE_NAME, UM_TENANT_ID);';
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$
DELIMITER ;

-- Call the stored procedure
CALL ALTER_UM_HYBRID_ROLE_UM_ROLE_NAME_INDEX();

DROP PROCEDURE IF EXISTS ALTER_UM_HYBRID_ROLE_UM_ROLE_NAME_INDEX;
