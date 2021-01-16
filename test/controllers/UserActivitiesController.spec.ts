import { assert, expect } from 'chai'
import * as moxios from 'moxios'
import { Dav } from '../../lib/Dav'
import { ApiResponse, ApiErrorResponse } from '../../lib/types'
import { GetUserActivities, GetUserActivitiesResponseData } from '../../lib/controllers/UserActivitiesController'

beforeEach(() => {
	moxios.install()
})

afterEach(() => {
	moxios.uninstall()
})

describe("GetUserActivities function", () => {
	it("should call getUserActivities endpoint", async () => {
		// Arrange
		let start = 111111111
		let end = 222222222
		let firstUserActivityTime = new Date("2021-01-11 23:00:00 UTC")
		let firstUserActivityCountDaily = 12
		let firstUserActivityCountMonthly = 15
		let firstUserActivityCountYearly = 20
		let secondUserActivityTime = new Date("2021-01-16 23:00:00 UTC")
		let secondUserActivityCountDaily = 7
		let secondUserActivityCountMonthly = 11
		let secondUserActivityCountYearly = 22

		let jwt = "iohafduwe98hh9fesbodc"
		let url = `${Dav.apiBaseUrl}/user_activities`

		let expectedResult: ApiResponse<GetUserActivitiesResponseData> = {
			status: 200,
			data: {
				days: [
					{
						time: firstUserActivityTime,
						countDaily: firstUserActivityCountDaily,
						countMonthly: firstUserActivityCountMonthly,
						countYearly: firstUserActivityCountYearly
					},
					{
						time: secondUserActivityTime,
						countDaily: secondUserActivityCountDaily,
						countMonthly: secondUserActivityCountMonthly,
						countYearly: secondUserActivityCountYearly
					}
				]
			}
		}

		moxios.wait(() => {
			let request = moxios.requests.mostRecent()

			// Assert for the request
			assert.equal(request.config.url, url)
			assert.equal(request.config.method, 'get')
			assert.equal(request.config.headers.Authorization, jwt)

			assert.equal(start, request.config.params.start)
			assert.equal(end, request.config.params.end)

			request.respondWith({
				status: expectedResult.status,
				response: {
					days: [
						{
							time: firstUserActivityTime.toString(),
							count_daily: firstUserActivityCountDaily,
							count_monthly: firstUserActivityCountMonthly,
							count_yearly: firstUserActivityCountYearly
						},
						{
							time: secondUserActivityTime.toString(),
							count_daily: secondUserActivityCountDaily,
							count_monthly: secondUserActivityCountMonthly,
							count_yearly: secondUserActivityCountYearly
						}
					]
				}
			})
		})

		// Act
		let result = await GetUserActivities({
			jwt,
			start,
			end
		}) as ApiResponse<GetUserActivitiesResponseData>

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
		assert.equal(result.data.days.length, 2)

		assert.equal(result.data.days[0].time.toString(), expectedResult.data.days[0].time.toString())
		assert.equal(result.data.days[0].countDaily, expectedResult.data.days[0].countDaily)
		assert.equal(result.data.days[0].countMonthly, expectedResult.data.days[0].countMonthly)
		assert.equal(result.data.days[0].countYearly, expectedResult.data.days[0].countYearly)

		assert.equal(result.data.days[1].time.toString(), expectedResult.data.days[1].time.toString())
		assert.equal(result.data.days[1].countDaily, expectedResult.data.days[1].countDaily)
		assert.equal(result.data.days[1].countMonthly, expectedResult.data.days[1].countMonthly)
		assert.equal(result.data.days[1].countYearly, expectedResult.data.days[1].countYearly)
	})

	it("should call getUserActivities endpoint with error", async () => {
		// Arrange
		let start = 111111111
		let end = 222222222

		let jwt = "iohafduwe98hh9fesbodc"
		let url = `${Dav.apiBaseUrl}/user_activities`

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
			assert.equal(request.config.headers.Authorization, jwt)

			assert.equal(start, request.config.params.start)
			assert.equal(end, request.config.params.end)

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
		let result = await GetUserActivities({
			jwt,
			start,
			end
		}) as ApiErrorResponse

		// Assert for the response
		assert.equal(result.status, expectedResult.status)
		assert.equal(result.errors[0].code, expectedResult.errors[0].code)
		assert.equal(result.errors[0].message, expectedResult.errors[0].message)
	})
})