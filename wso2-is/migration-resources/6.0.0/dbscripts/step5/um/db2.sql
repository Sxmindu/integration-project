BEGIN
    DECLARE const_name0 VARCHAR(128);
    DECLARE const_name1 VARCHAR(128);
    DECLARE STMT VARCHAR(200);
    SELECT  k.CONSTNAME
    INTO const_name0
    FROM SYSCAT.KEYCOLUSE k JOIN SYSCAT.TABCONST t ON k.CONSTNAME = t.CONSTNAME AND k.TABSCHEMA = t.TABSCHEMA
    WHERE t.TABNAME = 'UM_USER' AND t.TYPE='U' AND k.COLNAME = 'UM_USER_ID';
    
    IF const_name0 IS NOT NULL THEN
        SET STMT = 'ALTER TABLE UM_USER DROP CONSTRAINT ' || const_name0;
        PREPARE S1 FROM STMT;
        EXECUTE S1;
    END IF;
    
    SELECT k.CONSTNAME
    INTO const_name1
    FROM SYSCAT.KEYCOLUSE k JOIN SYSCAT.TABCONST t ON k.CONSTNAME = t.CONSTNAME AND k.TABSCHEMA = t.TABSCHEMA
    WHERE t.TABNAME = 'UM_USER' AND t.TYPE='U' AND k.COLNAME = 'UM_USER_NAME';
    
    IF const_name1 IS NULL THEN
        SET STMT = 'ALTER TABLE UM_USER ADD UNIQUE(UM_USER_NAME,UM_TENANT_ID)';
        PREPARE S1 FROM STMT;
        EXECUTE S1 ;
    END IF;
END
/

ALTER TABLE UM_USER ADD UNIQUE(UM_USER_ID)
/

CREATE UNIQUE INDEX INDEX_UM_USERNAME_UM_TENANT_ID ON UM_USER(UM_USER_NAME, UM_TENANT_ID)
/

ALTER TABLE UM_TENANT ADD COLUMN UM_ORG_UUID VARCHAR(36) DEFAULT NULL
/

------------------------ ORGANIZATION MANAGEMENT TABLES -------------------------

CREATE TABLE IF NOT EXISTS UM_ORG (
    UM_ID VARCHAR(36) NOT NULL,
    UM_ORG_NAME VARCHAR(255) NOT NULL,
    UM_ORG_DESCRIPTION VARCHAR(1024),
    UM_CREATED_TIME TIMESTAMP NOT NULL,
    UM_LAST_MODIFIED TIMESTAMP NOT NULL,
    UM_STATUS VARCHAR(255) DEFAULT 'ACTIVE' NOT NULL,
    UM_PARENT_ID VARCHAR(36),
    UM_ORG_TYPE VARCHAR(100) NOT NULL,
    PRIMARY KEY (UM_ID),
    FOREIGN KEY (UM_PARENT_ID) REFERENCES UM_ORG(UM_ID) ON DELETE CASCADE
)
/

INSERT INTO UM_ORG (UM_ID, UM_ORG_NAME, UM_ORG_DESCRIPTION, UM_CREATED_TIME, UM_LAST_MODIFIED, UM_STATUS, UM_ORG_TYPE)
SELECT '10084a8d-113f-4211-a0d5-efe36b082211', 'Super', 'This is the super organization.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'ACTIVE', 'TENANT' FROM "SYSIBM".SYSDUMMY1
WHERE NOT EXISTS (SELECT * FROM UM_ORG WHERE UM_ID = '10084a8d-113f-4211-a0d5-efe36b082211')
/

CREATE TABLE IF NOT EXISTS UM_ORG_ATTRIBUTE (
    UM_ID INTEGER NOT NULL,
    UM_ORG_ID VARCHAR(36) NOT NULL,
    UM_ATTRIBUTE_KEY VARCHAR(255) NOT NULL,
    UM_ATTRIBUTE_VALUE VARCHAR(512),
    PRIMARY KEY (UM_ID),
    UNIQUE (UM_ORG_ID, UM_ATTRIBUTE_KEY),
    FOREIGN KEY (UM_ORG_ID) REFERENCES UM_ORG(UM_ID) ON DELETE CASCADE
)
/

CREATE SEQUENCE UM_ORG_ATTRIBUTE_SEQUENCE AS DECIMAL(27,0)
    INCREMENT BY 1
    START WITH 1
    NO CACHE
/

CREATE TRIGGER UM_ORG_ATTRIBUTE_TRIG NO CASCADE BEFORE INSERT ON UM_ORG_ATTRIBUTE
REFERENCING NEW AS NEW FOR EACH ROW MODE DB2SQL
BEGIN ATOMIC
    SET (NEW.UM_ID)
       = (NEXTVAL FOR UM_ORG_ATTRIBUTE_SEQUENCE);
END
/

CREATE TABLE IF NOT EXISTS UM_ORG_ROLE (
            UM_ROLE_ID VARCHAR(255) NOT NULL,
            UM_ROLE_NAME VARCHAR(255) NOT NULL,
            UM_ORG_ID VARCHAR(36) NOT NULL,
            PRIMARY KEY(UM_ROLE_ID),
            CONSTRAINT FK_UM_ORG_ROLE_UM_ORG FOREIGN KEY (UM_ORG_ID) REFERENCES UM_ORG (UM_ID) ON DELETE CASCADE
)
/

CREATE TABLE IF NOT EXISTS UM_ORG_PERMISSION(
            UM_ID INTEGER NOT NULL,
            UM_RESOURCE_ID VARCHAR(255) NOT NULL,
            UM_ACTION VARCHAR(255) NOT NULL,
            UM_TENANT_ID INTEGER DEFAULT 0,
            PRIMARY KEY (UM_ID)
)/

CREATE SEQUENCE UM_ORG_PERMISSION_SEQUENCE AS DECIMAL(27,0)
    INCREMENT BY 1
    START WITH 1
    NO CACHE
/

CREATE TRIGGER UM_ORG_PERMISSION_TRIG NO CASCADE BEFORE INSERT ON UM_ORG_PERMISSION
REFERENCING NEW AS NEW FOR EACH ROW MODE DB2SQL
BEGIN ATOMIC
    SET (NEW.UM_ID)
       = (NEXTVAL FOR UM_ORG_PERMISSION_SEQUENCE);
END
/

CREATE TABLE IF NOT EXISTS UM_ORG_ROLE_USER (
    UM_USER_ID VARCHAR(255) NOT NULL,
    UM_ROLE_ID VARCHAR(255) NOT NULL,
    CONSTRAINT FK_UM_ORG_ROLE_USER_UM_ORG_ROLE FOREIGN KEY (UM_ROLE_ID) REFERENCES UM_ORG_ROLE(UM_ROLE_ID) ON DELETE CASCADE
)
/

CREATE TABLE IF NOT EXISTS UM_ORG_ROLE_GROUP(
    UM_GROUP_ID VARCHAR(255) NOT NULL,
    UM_ROLE_ID VARCHAR(255) NOT NULL,
    CONSTRAINT FK_UM_ORG_ROLE_GROUP_UM_ORG_ROLE FOREIGN KEY (UM_ROLE_ID) REFERENCES UM_ORG_ROLE(UM_ROLE_ID) ON DELETE CASCADE
)
/

CREATE TABLE IF NOT EXISTS UM_ORG_ROLE_PERMISSION(
    UM_PERMISSION_ID INTEGER NOT NULL,
    UM_ROLE_ID VARCHAR(255) NOT NULL,
    CONSTRAINT FK_UM_ORG_ROLE_PERMISSION_UM_ORG_ROLE FOREIGN KEY (UM_ROLE_ID) REFERENCES UM_ORG_ROLE(UM_ROLE_ID) ON DELETE CASCADE,
    CONSTRAINT FK_UM_ORG_ROLE_PERMISSION_UM_ORG_PERMISSION FOREIGN KEY (UM_PERMISSION_ID) REFERENCES UM_ORG_PERMISSION(UM_ID) ON DELETE CASCADE
)
/

CREATE TABLE UM_ORG_HIERARCHY (
    UM_PARENT_ID VARCHAR(36) NOT NULL,
    UM_ID VARCHAR(36) NOT NULL,
    DEPTH INTEGER,
    PRIMARY KEY (UM_PARENT_ID, UM_ID),
    FOREIGN KEY (UM_PARENT_ID) REFERENCES UM_ORG(UM_ID) ON DELETE CASCADE,
    FOREIGN KEY (UM_ID) REFERENCES UM_ORG(UM_ID) ON DELETE CASCADE
)
/

INSERT INTO UM_ORG_HIERARCHY (UM_PARENT_ID, UM_ID, DEPTH)
SELECT '10084a8d-113f-4211-a0d5-efe36b082211', '10084a8d-113f-4211-a0d5-efe36b082211', 0 FROM "SYSIBM".SYSDUMMY1
WHERE NOT EXISTS (SELECT * FROM UM_ORG_HIERARCHY WHERE UM_PARENT_ID = '10084a8d-113f-4211-a0d5-efe36b082211' AND UM_ID = '10084a8d-113f-4211-a0d5-efe36b082211')
/

-------------------------GROUP ID DOMAIN MAPPER TABLES ----------------------------

CREATE TABLE UM_GROUP_UUID_DOMAIN_MAPPER (
    UM_ID INTEGER NOT NULL,
    UM_GROUP_ID VARCHAR(255) NOT NULL,
    UM_DOMAIN_ID INTEGER NOT NULL,
    UM_TENANT_ID INTEGER DEFAULT 0,
    PRIMARY KEY (UM_ID),
    UNIQUE (UM_GROUP_ID),
    FOREIGN KEY (UM_DOMAIN_ID, UM_TENANT_ID) REFERENCES UM_DOMAIN(UM_DOMAIN_ID, UM_TENANT_ID) ON DELETE CASCADE
)
/

CREATE SEQUENCE UM_GROUP_UUID_DOMAIN_MAPPER_SEQUENCE AS DECIMAL(27,0)
    INCREMENT BY 1
    START WITH 1
    NO CACHE
/

CREATE TRIGGER UMGROUP_UUID_DOMAIN_MAPPER NO CASCADE BEFORE INSERT ON UM_GROUP_UUID_DOMAIN_MAPPER
REFERENCING NEW AS NEW FOR EACH ROW MODE DB2SQL
BEGIN ATOMIC
    SET (NEW.UM_ID)
       = (NEXTVAL FOR UM_GROUP_UUID_DOMAIN_MAPPER_SEQUENCE);
END
/

CREATE INDEX UUID_GRP_UID_TID ON UM_GROUP_UUID_DOMAIN_MAPPER(UM_GROUP_ID, UM_TENANT_ID)
/
