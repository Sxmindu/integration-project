-- NOTE: This procedure assumes that the SAML IDP metadata is stored under the path
-- '/_system/governance/repository/identity/provider/saml' in the registry and only two corresponding RESOURCE entries
-- (one for the collection and one for the resource object) and one CONTENT entry exist for each SAML IDP metadata file.

--<![[Start of Procedure]]>--
BEGIN
   DECLARE batchSize INT;
   DECLARE chunkSize INT;
   DECLARE batchCount INT;
   DECLARE chunkCount INT;
   DECLARE rowCount INT;
   DECLARE enableLog SMALLINT;
   DECLARE backupTables SMALLINT;

   SET batchSize    = 10000;
   SET chunkSize    = 500000;
   SET enableLog    = 1;
   SET backupTables = 0;
   SET rowCount = 0;
   SET batchCount = 1;
   SET chunkCount = 1;

   EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS LOGGER';
   EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS RootPathIdList';
   EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS PathIdList';
   EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS ContentIdList';

   EXECUTE IMMEDIATE 'CREATE TABLE LOGGER (MESSAGE VARCHAR(255))';
   EXECUTE IMMEDIATE 'CREATE TABLE RootPathIdList (ROOT_PATH_ID INT)';
   EXECUTE IMMEDIATE 'CREATE TABLE PathIdList (REG_PATH_ID INT)';
   EXECUTE IMMEDIATE 'COMMIT';

   IF (enableLog = 1) THEN
      EXECUTE IMMEDIATE 'INSERT INTO LOGGER VALUES (''WSO2_SAML_IDP_METADATA_CLEANUP() STARTED...'')';
   END IF;

   EXECUTE IMMEDIATE 'INSERT INTO RootPathIdList (ROOT_PATH_ID)
                       SELECT REG_PATH_ID FROM REG_PATH WHERE REG_PATH_VALUE = ''/_system/governance/repository/identity/provider/saml''';

   EXECUTE IMMEDIATE 'INSERT INTO PathIdList (REG_PATH_ID)
                       SELECT REG_PATH_ID FROM REG_PATH WHERE REG_PATH_PARENT_ID IN (SELECT ROOT_PATH_ID FROM RootPathIdList)';

   IF (backupTables = 1) THEN
      IF (enableLog = 1) THEN
         EXECUTE IMMEDIATE 'INSERT INTO LOGGER VALUES (''TABLE BACKUP STARTED...'')';
      END IF;

      EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS BAK_REG_RESOURCE';
      EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS BAK_REG_CONTENT';
      EXECUTE IMMEDIATE 'COMMIT';

      EXECUTE IMMEDIATE 'CREATE TABLE BAK_REG_RESOURCE AS
                         (SELECT * FROM REG_RESOURCE WHERE REG_PATH_ID IN (SELECT REG_PATH_ID FROM PathIdList)) WITH DATA';

      EXECUTE IMMEDIATE 'CREATE TABLE ContentIdList AS
                         (SELECT DISTINCT REG_CONTENT_ID FROM BAK_REG_RESOURCE WHERE REG_CONTENT_ID IS NOT NULL) WITH DATA';

      EXECUTE IMMEDIATE 'CREATE TABLE BAK_REG_CONTENT AS
                         (SELECT * FROM REG_CONTENT WHERE REG_CONTENT_ID IN (SELECT REG_CONTENT_ID FROM ContentIdList)) WITH DATA';

      EXECUTE IMMEDIATE 'COMMIT';
   END IF;

   chunk_loop: WHILE (chunkCount > 0) DO
      EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS REG_RESOURCE_CHUNK_TMP';
      EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS REG_CONTENT_CHUNK_TMP';
      EXECUTE IMMEDIATE 'CREATE TABLE REG_RESOURCE_CHUNK_TMP (REG_VERSION INT, REG_TENANT_ID INT, REG_CONTENT_ID INT)';
      EXECUTE IMMEDIATE 'CREATE TABLE REG_CONTENT_CHUNK_TMP (REG_CONTENT_ID INT)';
      EXECUTE IMMEDIATE 'COMMIT';

      EXECUTE IMMEDIATE 'INSERT INTO REG_RESOURCE_CHUNK_TMP
                         SELECT REG_VERSION, REG_TENANT_ID, REG_CONTENT_ID FROM REG_RESOURCE
                         WHERE REG_PATH_ID IN (SELECT REG_PATH_ID FROM PathIdList) LIMIT ' || chunkSize;

      GET DIAGNOSTICS chunkCount = ROW_COUNT;

      EXECUTE IMMEDIATE 'INSERT INTO REG_CONTENT_CHUNK_TMP
                         SELECT REG_CONTENT_ID FROM REG_RESOURCE_CHUNK_TMP WHERE REG_CONTENT_ID IS NOT NULL';

      IF chunkCount = 0 THEN
         LEAVE chunk_loop;
      END IF;

      SET batchCount = 1;
      batch_loop: WHILE (batchCount > 0) DO
         EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS REG_RESOURCE_BATCH_TMP';
         EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS REG_CONTENT_BATCH_TMP';
         EXECUTE IMMEDIATE 'CREATE TABLE REG_RESOURCE_BATCH_TMP (REG_VERSION INT, REG_TENANT_ID INT, REG_CONTENT_ID INT)';
         EXECUTE IMMEDIATE 'CREATE TABLE REG_CONTENT_BATCH_TMP (REG_CONTENT_ID INT)';
         EXECUTE IMMEDIATE 'COMMIT';

         EXECUTE IMMEDIATE 'INSERT INTO REG_RESOURCE_BATCH_TMP
                            SELECT REG_VERSION, REG_TENANT_ID, REG_CONTENT_ID FROM REG_RESOURCE_CHUNK_TMP LIMIT ' || batchSize;

         GET DIAGNOSTICS batchCount = ROW_COUNT;

         EXECUTE IMMEDIATE 'INSERT INTO REG_CONTENT_BATCH_TMP
                            SELECT REG_CONTENT_ID FROM REG_RESOURCE_BATCH_TMP WHERE REG_CONTENT_ID IS NOT NULL';

         IF batchCount = 0 THEN
            LEAVE batch_loop;
         END IF;

         IF (enableLog = 1) THEN
            EXECUTE IMMEDIATE 'INSERT INTO LOGGER VALUES (''BATCH DELETE STARTED ON REG_RESOURCE...'')';
         END IF;

         EXECUTE IMMEDIATE 'DELETE FROM REG_RESOURCE
                            WHERE EXISTS (SELECT 1 FROM REG_RESOURCE_BATCH_TMP tmp
                                          WHERE REG_RESOURCE.REG_VERSION = tmp.REG_VERSION
                                          AND REG_RESOURCE.REG_TENANT_ID = tmp.REG_TENANT_ID)';

         GET DIAGNOSTICS rowCount = ROW_COUNT;

         EXECUTE IMMEDIATE 'DELETE FROM REG_CONTENT
                            WHERE REG_CONTENT_ID IN (SELECT REG_CONTENT_ID FROM REG_CONTENT_BATCH_TMP)';

         IF (enableLog = 1) THEN
            EXECUTE IMMEDIATE 'INSERT INTO LOGGER VALUES (''BATCH DELETE FINISHED ON REG_RESOURCE WITH ' || rowCount || ' ROWS'')';
         END IF;

         EXECUTE IMMEDIATE 'DELETE FROM REG_RESOURCE_CHUNK_TMP
                            WHERE EXISTS (SELECT 1 FROM REG_RESOURCE_BATCH_TMP tmp
                                          WHERE REG_RESOURCE_CHUNK_TMP.REG_VERSION = tmp.REG_VERSION
                                          AND REG_RESOURCE_CHUNK_TMP.REG_TENANT_ID = tmp.REG_TENANT_ID)';
      END WHILE;
   END WHILE;

   EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS RootPathIdList';
   EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS PathIdList';
   EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS ContentIdList';
   EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS REG_RESOURCE_BATCH_TMP';
   EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS REG_CONTENT_BATCH_TMP';
   EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS REG_RESOURCE_CHUNK_TMP';
   EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS REG_CONTENT_CHUNK_TMP';
   EXECUTE IMMEDIATE 'COMMIT';

   IF (enableLog = 1) THEN
      EXECUTE IMMEDIATE 'INSERT INTO LOGGER VALUES (''CLEANUP COMPLETED SUCCESSFULLY.'')';
   END IF;

END;
--<![[End of Procedure]]>--
