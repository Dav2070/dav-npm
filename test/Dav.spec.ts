import * as Dav from '../lib/Dav';
import { assert } from 'chai';
import 'mocha';
import { TableObject } from '../lib/models/TableObject';
import { DavEnvironment } from '../lib/models/DavUser';

describe("Initialize function", () => {
   it("should set globals variables to the appropriate values", () => {
      // Arrange
      var environment = DavEnvironment.Test;
      var appId = -23;
      var tableIds = [12, 213];
      var callbacks = {
         UpdateAllOfTable: () => {},
         UpdateTableObject: () => {},
         DeleteTableObject: () => {},
         SyncFinished: () => {}
      }

      // Act
      Dav.Initialize(environment, appId, tableIds, [], false, {icon: "", badge: ""}, callbacks);

      // Assert
      assert.equal(environment, Dav.globals.environment);
      assert.equal(appId, Dav.globals.appId)
   });
});

describe("Globals class", () => {
   it("should return different values for apiBaseUrl and websiteUrl in different environments", () => {
      // Arrange
      var environment = DavEnvironment.Test;
      var appId = 12;
      var tableIds = [12, 123];
      var callbacks = {
         UpdateAllOfTable: () => {},
         UpdateTableObject: () => {},
         DeleteTableObject: () => {},
         SyncFinished: () => {}
      }

      // Act
      Dav.Initialize(environment, appId, tableIds, [], false, {icon: "", badge: ""}, callbacks);
      var firstWebsiteUrl = Dav.globals.websiteUrl;
      var firstApiBaseUrl = Dav.globals.apiBaseUrl;

      environment = DavEnvironment.Production;

      Dav.Initialize(environment, appId, tableIds, [], false, {icon: "", badge: ""}, callbacks);
      var secondWebsiteUrl = Dav.globals.websiteUrl;
      var secondApiBaseUrl = Dav.globals.apiBaseUrl;

      // Assert
      assert.notEqual(firstWebsiteUrl, secondWebsiteUrl);
      assert.notEqual(secondWebsiteUrl, secondApiBaseUrl);
   });

   it("should call callback methods", () => {
      // Arrange
      var environment = DavEnvironment.Test;
      var appId = 13;
      var tableIds = [133, 121];

      var callingTableId = 12;
      var callingTableObject = new TableObject();

      var updateAllOfTableCalled = false;
      var updatedTableId = -1;
      var updatedTableIdChanged = false;
      var updateTableObjectCalled = false;
      var updatedTableObjectUuid = "";
      var deleteTableObjectCalled = false;
      var deletedTableObjectUuid = "";
      var syncFinishedCalled = false;

      var callbacks = {
         UpdateAllOfTable: (tableId: number, changed: boolean) => {
            updateAllOfTableCalled = true;
				updatedTableId = tableId;
				updatedTableIdChanged = changed;
         },
         UpdateTableObject: (tableObject: TableObject) => {
            updateTableObjectCalled = true;
            updatedTableObjectUuid = tableObject.Uuid;
         },
         DeleteTableObject: (tableObject: TableObject) => {
            deleteTableObjectCalled = true;
            deletedTableObjectUuid = tableObject.Uuid;
         },
         SyncFinished: () => {
            syncFinishedCalled = true;
         }
      }

      Dav.Initialize(environment, appId, tableIds, [], false, {icon: "", badge: ""}, callbacks);

      // Act
      Dav.globals.callbacks.UpdateAllOfTable(callingTableId, true);
      Dav.globals.callbacks.UpdateTableObject(callingTableObject);
      Dav.globals.callbacks.DeleteTableObject(callingTableObject);
      Dav.globals.callbacks.SyncFinished();

      // Assert
      assert.isTrue(updateAllOfTableCalled);
      assert.isTrue(updateTableObjectCalled);
      assert.isTrue(deleteTableObjectCalled);
      assert.isTrue(syncFinishedCalled);
      assert.equal(callingTableId, updatedTableId);
      assert.isTrue(updatedTableIdChanged);
      assert.equal(callingTableObject.Uuid, updatedTableObjectUuid);
      assert.equal(callingTableObject.Uuid, deletedTableObjectUuid);
   });
});