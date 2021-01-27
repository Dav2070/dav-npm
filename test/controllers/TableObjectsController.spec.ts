import { assert } from 'chai'
import * as moxios from 'moxios'
import { Dav } from '../../lib/Dav'
import { ApiResponse, ApiErrorResponse } from '../../lib/types'
import { TableObject } from '../../lib/models/TableObject'
import {
	CreateTableObject,
	GetTableObject,
	UpdateTableObject,
	DeleteTableObject,
	RemoveTableObject
} from '../../lib/controllers/TableObjectsController'

beforeEach(() => {
	moxios.install()
})

afterEach(() => {
	moxios.uninstall()
})

describe("CreateTableObject function", () => {
	it("should call createTableObject endpoint", async () => {
		// Arrange
		let uuid = "cc229955-1e1f-4dc2-8e42-6d265df4bc65"
		let tableId = 52
		let file = false
		let firstPropertyName = "page1"
		let firstPropertyValue = "Hello World"
		let secondPropertyName = "page2"
		let secondPropertyValue = 523.1

		let tableObject = new TableObject(uuid)
		tableObject.TableId = tableId
		tableObject.IsFile = file
		tableObject.Properties = {
			[firstPropertyName]: { value: firstPropertyValue },
			[secondPropertyName]: { value: secondPropertyValue }
		}

		let accessToken = "asdasdasdasd"
		let url = `${Dav.apiBaseUrl}/table_object`

		let expectedResult: ApiResponse<TableObject> = {
			status: 201,
			data: tableObject
		}

		moxios.wait(() => {
			let request = moxios.requests.mostRecent()

			// Assert for the request
			assert.equal(request.config.url, url)
			assert.equal(request.config.method, 'post')
			assert.equal(request.config.headers.Authorization, accessToken)
			assert.include(request.config.headers["Content-Type"], "application/json")

			let data = JSON.parse(request.config.data)
			assert.equal(data.uuid, uuid)
			assert.equal(data.table_id, tableId)
			assert.equal(data.file, file)
			assert.equal(data.properties[firstPropertyName], firstPropertyValue)
			assert.equal(data.properties[secondPropertyName], secondPropertyValue)

			request.respondWith({
				status: expectedResult.status,
				response: {
					id: 12,
					user_id: 12,
					table_id: tableId,
					uuid,
					file,
					etag: "asdasaassadasd",
					properties: {
						[firstPropertyName]: firstPropertyValue,
						[secondPropertyName]: secondPropertyValue
					}
				}
			})
		})

		// Act
		let result = await CreateTableObject({
			accessToken,
			uuid,
			tableId,
			file,
			properties: {
				[firstPropertyName]: firstPropertyValue,
				[secondPropertyName]: secondPropertyValue
			}
		}) as ApiResponse<TableObject>

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
		assert.equal(result.data.TableId, expectedResult.data.TableId)
		assert.equal(result.data.Uuid, expectedResult.data.Uuid)
		assert.equal(result.data.IsFile, expectedResult.data.IsFile)
		assert.equal(Object.keys(result.data.Properties).length, Object.keys(expectedResult.data.Properties).length)
		assert.equal(result.data.GetPropertyValue(firstPropertyName), expectedResult.data.GetPropertyValue(firstPropertyName))
		assert.equal(result.data.GetPropertyValue(secondPropertyName), expectedResult.data.GetPropertyValue(secondPropertyName))
	})

	it("should call createTableObject endpoint with error", async () => {
		// Arrange
		let uuid = "cc229955-1e1f-4dc2-8e42-6d265df4bc65"
		let tableId = 52
		let file = false
		let firstPropertyName = "page1"
		let firstPropertyValue = "Hello World"
		let secondPropertyName = "page2"
		let secondPropertyValue = 523.1

		let accessToken = "asdasdasdasd"
		let url = `${Dav.apiBaseUrl}/table_object`

		let expectedResult: ApiErrorResponse = {
			status: 403,
			errors: [{
				code: 1103,
				message: "Action not allowed"
			}]
		}

		moxios.wait(() => {
			let request = moxios.requests.mostRecent()

			// Assert for the request
			assert.equal(request.config.url, url)
			assert.equal(request.config.method, 'post')
			assert.equal(request.config.headers.Authorization, accessToken)
			assert.include(request.config.headers["Content-Type"], "application/json")

			let data = JSON.parse(request.config.data)
			assert.equal(data.uuid, uuid)
			assert.equal(data.table_id, tableId)
			assert.equal(data.file, file)
			assert.equal(data.properties[firstPropertyName], firstPropertyValue)
			assert.equal(data.properties[secondPropertyName], secondPropertyValue)

			request.respondWith({
				status: expectedResult.status,
				response: {
					errors: [{
						code: expectedResult.errors[0].code,
						message: expectedResult.errors[0].message
					}]
				}
			})
		})

		// Act
		let result = await CreateTableObject({
			accessToken,
			uuid,
			tableId,
			file,
			properties: {
				[firstPropertyName]: firstPropertyValue,
				[secondPropertyName]: secondPropertyValue
			}
		}) as ApiErrorResponse

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
		assert.equal(result.errors[0].code, expectedResult.errors[0].code)
		assert.equal(result.errors[0].message, expectedResult.errors[0].message)
	})
})

describe("GetTableObject function", () => {
	it("should call getTableObject endpoint", async () => {
		// Arrange
		let uuid = "9491bd47-8d1f-4172-b290-c89a58f354dc"
		let tableId = 52
		let file = false
		let firstPropertyName = "test1"
		let firstPropertyValue = 42
		let secondPropertyName = "test2"
		let secondPropertyValue = true

		let tableObject = new TableObject(uuid)
		tableObject.TableId = tableId
		tableObject.IsFile = file
		tableObject.Properties = {
			[firstPropertyName]: { value: firstPropertyValue },
			[secondPropertyName]: { value: secondPropertyValue }
		}

		let accessToken = "iosdfshodhsdf"
		let url = `${Dav.apiBaseUrl}/table_object/${uuid}`

		let expectedResult: ApiResponse<TableObject> = {
			status: 201,
			data: tableObject
		}

		moxios.wait(() => {
			let request = moxios.requests.mostRecent()

			// Assert for the request
			assert.equal(request.config.url, url)
			assert.equal(request.config.method, 'get')
			assert.equal(request.config.headers.Authorization, accessToken)

			request.respondWith({
				status: expectedResult.status,
				response: {
					id: 12,
					user_id: 12,
					table_id: tableId,
					uuid,
					file,
					etag: "asdasaassadasd",
					properties: {
						[firstPropertyName]: firstPropertyValue,
						[secondPropertyName]: secondPropertyValue
					}
				}
			})
		})

		// Act
		let result = await GetTableObject({
			accessToken,
			uuid
		}) as ApiResponse<TableObject>

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
		assert.equal(result.data.TableId, expectedResult.data.TableId)
		assert.equal(result.data.Uuid, expectedResult.data.Uuid)
		assert.equal(result.data.IsFile, expectedResult.data.IsFile)
		assert.equal(Object.keys(result.data.Properties).length, Object.keys(expectedResult.data.Properties).length)
		assert.equal(result.data.GetPropertyValue(firstPropertyName), expectedResult.data.GetPropertyValue(firstPropertyName))
		assert.equal(result.data.GetPropertyValue(secondPropertyName), expectedResult.data.GetPropertyValue(secondPropertyName))
	})

	it("should call getTableObject endpoint with error", async () => {
		// Arrange
		let uuid = "9491bd47-8d1f-4172-b290-c89a58f354dc"

		let accessToken = "iosdfshodhsdf"
		let url = `${Dav.apiBaseUrl}/table_object/${uuid}`

		let expectedResult: ApiErrorResponse = {
			status: 403,
			errors: [{
				code: 1103,
				message: "Action not allowed"
			}]
		}

		moxios.wait(() => {
			let request = moxios.requests.mostRecent()

			// Assert for the request
			assert.equal(request.config.url, url)
			assert.equal(request.config.method, 'get')
			assert.equal(request.config.headers.Authorization, accessToken)

			request.respondWith({
				status: expectedResult.status,
				response: {
					errors: [{
						code: expectedResult.errors[0].code,
						message: expectedResult.errors[0].message
					}]
				}
			})
		})

		// Act
		let result = await GetTableObject({
			accessToken,
			uuid
		}) as ApiErrorResponse

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
		assert.equal(result.errors[0].code, expectedResult.errors[0].code)
		assert.equal(result.errors[0].message, expectedResult.errors[0].message)
	})
})

describe("UpdateTableObject function", () => {
	it("should call updateTableObject endpoint", async () => {
		// Arrange
		let uuid = "9491bd47-8d1f-4172-b290-c89a58f354dc"
		let tableId = 52
		let file = false
		let firstPropertyName = "test1"
		let firstPropertyValue = 42
		let secondPropertyName = "test2"
		let secondPropertyValue = true

		let tableObject = new TableObject(uuid)
		tableObject.TableId = tableId
		tableObject.IsFile = file
		tableObject.Properties = {
			[firstPropertyName]: { value: firstPropertyValue },
			[secondPropertyName]: { value: secondPropertyValue }
		}

		let accessToken = "iosdfshodhsdf"
		let url = `${Dav.apiBaseUrl}/table_object/${uuid}`

		let expectedResult: ApiResponse<TableObject> = {
			status: 201,
			data: tableObject
		}

		moxios.wait(() => {
			let request = moxios.requests.mostRecent()

			// Assert for the request
			assert.equal(request.config.url, url)
			assert.equal(request.config.method, 'put')
			assert.equal(request.config.headers.Authorization, accessToken)
			assert.include(request.config.headers["Content-Type"], "application/json")

			let data = JSON.parse(request.config.data)
			assert.equal(data.properties[firstPropertyName], firstPropertyValue)
			assert.equal(data.properties[secondPropertyName], secondPropertyValue)

			request.respondWith({
				status: expectedResult.status,
				response: {
					id: 12,
					user_id: 12,
					table_id: tableId,
					uuid,
					file,
					etag: "asdasaassadasd",
					properties: {
						[firstPropertyName]: firstPropertyValue,
						[secondPropertyName]: secondPropertyValue
					}
				}
			})
		})

		// Act
		let result = await UpdateTableObject({
			accessToken,
			uuid,
			properties: {
				[firstPropertyName]: firstPropertyValue,
				[secondPropertyName]: secondPropertyValue
			}
		}) as ApiResponse<TableObject>

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
		assert.equal(result.data.TableId, expectedResult.data.TableId)
		assert.equal(result.data.Uuid, expectedResult.data.Uuid)
		assert.equal(result.data.IsFile, expectedResult.data.IsFile)
		assert.equal(Object.keys(result.data.Properties).length, Object.keys(expectedResult.data.Properties).length)
		assert.equal(result.data.GetPropertyValue(firstPropertyName), expectedResult.data.GetPropertyValue(firstPropertyName))
		assert.equal(result.data.GetPropertyValue(secondPropertyName), expectedResult.data.GetPropertyValue(secondPropertyName))
	})

	it("should call updateTableObject endpoint with error", async () => {
		// Arrange
		let uuid = "9491bd47-8d1f-4172-b290-c89a58f354dc"
		let firstPropertyName = "test1"
		let firstPropertyValue = 42
		let secondPropertyName = "test2"
		let secondPropertyValue = true

		let accessToken = "iosdfshodhsdf"
		let url = `${Dav.apiBaseUrl}/table_object/${uuid}`

		let expectedResult: ApiErrorResponse = {
			status: 403,
			errors: [{
				code: 1103,
				message: "Action not allowed"
			}]
		}

		moxios.wait(() => {
			let request = moxios.requests.mostRecent()

			// Assert for the request
			assert.equal(request.config.url, url)
			assert.equal(request.config.method, 'put')
			assert.equal(request.config.headers.Authorization, accessToken)
			assert.include(request.config.headers["Content-Type"], "application/json")

			let data = JSON.parse(request.config.data)
			assert.equal(data.properties[firstPropertyName], firstPropertyValue)
			assert.equal(data.properties[secondPropertyName], secondPropertyValue)

			request.respondWith({
				status: expectedResult.status,
				response: {
					errors: [{
						code: expectedResult.errors[0].code,
						message: expectedResult.errors[0].message
					}]
				}
			})
		})

		// Act
		let result = await UpdateTableObject({
			accessToken,
			uuid,
			properties: {
				[firstPropertyName]: firstPropertyValue,
				[secondPropertyName]: secondPropertyValue
			}
		}) as ApiErrorResponse

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
		assert.equal(result.errors[0].code, expectedResult.errors[0].code)
		assert.equal(result.errors[0].message, expectedResult.errors[0].message)
	})
})

describe("DeleteTableObject function", () => {
	it("should call deleteTableObject endpoint", async () => {
		// Arrange
		let uuid = "9491bd47-8d1f-4172-b290-c89a58f354dc"

		let accessToken = "iosdfshodhsdf"
		let url = `${Dav.apiBaseUrl}/table_object/${uuid}`

		let expectedResult: ApiResponse<{}> = {
			status: 204,
			data: {}
		}

		moxios.wait(() => {
			let request = moxios.requests.mostRecent()

			// Assert for the request
			assert.equal(request.config.url, url)
			assert.equal(request.config.method, 'delete')
			assert.equal(request.config.headers.Authorization, accessToken)

			request.respondWith({
				status: expectedResult.status,
				response: {}
			})
		})

		// Act
		let result = await DeleteTableObject({
			accessToken,
			uuid
		}) as ApiResponse<{}>

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
	})

	it("should call deleteTableObject endpoint with error", async () => {
		// Arrange
		let uuid = "9491bd47-8d1f-4172-b290-c89a58f354dc"

		let accessToken = "iosdfshodhsdf"
		let url = `${Dav.apiBaseUrl}/table_object/${uuid}`

		let expectedResult: ApiErrorResponse = {
			status: 403,
			errors: [{
				code: 1103,
				message: "Action not allowed"
			}]
		}

		moxios.wait(() => {
			let request = moxios.requests.mostRecent()

			// Assert for the request
			assert.equal(request.config.url, url)
			assert.equal(request.config.method, 'delete')
			assert.equal(request.config.headers.Authorization, accessToken)

			request.respondWith({
				status: expectedResult.status,
				response: {
					errors: [{
						code: expectedResult.errors[0].code,
						message: expectedResult.errors[0].message
					}]
				}
			})
		})

		// Act
		let result = await DeleteTableObject({
			accessToken,
			uuid
		}) as ApiErrorResponse

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
		assert.equal(result.errors[0].code, expectedResult.errors[0].code)
		assert.equal(result.errors[0].message, expectedResult.errors[0].message)
	})
})

describe("RemoveTableObject function", () => {
	it("should call removeTableObject endpoint", async () => {
		// Arrange
		let uuid = "9491bd47-8d1f-4172-b290-c89a58f354dc"

		let accessToken = "iosdfshodhsdf"
		let url = `${Dav.apiBaseUrl}/table_object/${uuid}/access`

		let expectedResult: ApiResponse<{}> = {
			status: 204,
			data: {}
		}

		moxios.wait(() => {
			let request = moxios.requests.mostRecent()

			// Assert for the request
			assert.equal(request.config.url, url)
			assert.equal(request.config.method, 'delete')
			assert.equal(request.config.headers.Authorization, accessToken)

			request.respondWith({
				status: expectedResult.status,
				response: {}
			})
		})

		// Act
		let result = await RemoveTableObject({
			accessToken,
			uuid
		}) as ApiResponse<{}>

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
	})

	it("should call removeTableObject endpoint with error", async () => {
		// Arrange
		let uuid = "9491bd47-8d1f-4172-b290-c89a58f354dc"

		let accessToken = "iosdfshodhsdf"
		let url = `${Dav.apiBaseUrl}/table_object/${uuid}/access`

		let expectedResult: ApiErrorResponse = {
			status: 403,
			errors: [{
				code: 1103,
				message: "Action not allowed"
			}]
		}

		moxios.wait(() => {
			let request = moxios.requests.mostRecent()

			// Assert for the request
			assert.equal(request.config.url, url)
			assert.equal(request.config.method, 'delete')
			assert.equal(request.config.headers.Authorization, accessToken)

			request.respondWith({
				status: expectedResult.status,
				response: {
					errors: [{
						code: expectedResult.errors[0].code,
						message: expectedResult.errors[0].message
					}]
				}
			})
		})

		// Act
		let result = await RemoveTableObject({
			accessToken,
			uuid
		}) as ApiErrorResponse

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
		assert.equal(result.errors[0].code, expectedResult.errors[0].code)
		assert.equal(result.errors[0].message, expectedResult.errors[0].message)
	})
})