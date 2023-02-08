import axios from 'axios';
import {API_URL,PORT} from '../../env.json';
import moment from 'moment';
// import {CheckDevice,DataEmpty} from "../components/deviceInfo";
let url;


let mock_data = [
    {
        "flagName": "checkboss",
        "flagId": 9,
        "flagSequence": 1,
        "colorCode": "#000000",
        "isImportant": false,
        "userName": null,
        "monitoringSituations": [
            {
                "monitoringName": "UB ",
                "monitoringStatusMessage": "",
                "situationName": "UBQA",
                "monitoringDesc": "DESC",
                "monitoringStatusLastUpdated": "2021.07.30 07:04:31",
                "monitoringStatusTimeStamp": "2021.06.09 11:26:44",
                "monitoringStatusId": 50218,
                "monitoringId": 611,
                "criticalTimeSeconds": 0,
                "systemName": "UB System",
                "actions": [
                    {
                        "actionId": 0,
                        "actionName": "Other",
                        "actionDesc": "Use this option to write a comment.",
                        "lastUpdated": "2021.07.30 07:06:52"
                    }
                ],
                "measurements": [
                    {
                        "measureName": "SENSOR",
                        "actualReading": "100",
                        "actualTime": "2021-04-01T10:07:43",
                        "mainReading": "90",
                        "unitName": " ",
                        "icon": "pos",
                        "ruleTriggered": 1
                    }
                ]
            }
        ]
    },
        {
            "flagName": "Action Required",
            "flagId": 4,
            "flagSequence": 2,
            "colorCode": "#FF5927",
            "isImportant": true,
            "userName": null,
            "monitoringSituations": [
                {
                    "monitoringName": "UB ",
                    "monitoringStatusMessage": "",
                    "situationName": "UBQA",
                    "monitoringDesc": "DESC",
                    "monitoringStatusLastUpdated": "2021.07.30 07:04:31",
                    "monitoringStatusTimeStamp": "2021.06.09 11:26:44",
                    "monitoringStatusId": 50218,
                    "monitoringId": 611,
                    "criticalTimeSeconds": 0,
                    "systemName": "UB System",
                    "actions": [
                        {
                            "actionId": 0,
                            "actionName": "Other",
                            "actionDesc": "Use this option to write a comment.",
                            "lastUpdated": "2021.07.30 07:06:52"
                        }
                    ],
                    "measurements": [
                        {
                            "measureName": "SENSOR",
                            "actualReading": "100",
                            "actualTime": "2021-04-01T10:07:43",
                            "mainReading": "90",
                            "unitName": " ",
                            "icon": "pos",
                            "ruleTriggered": 1
                        }
                    ]
                }
            ]
        },
        {
            "flagName": "Escalated",
            "flagId": 5,
            "flagSequence": 1,
            "colorCode": "#ffff00",
            "isImportant": true,
            "userName": null,
            "monitoringSituations": [
                {
                    "monitoringName": "UB ",
                    "monitoringStatusMessage": "",
                    "situationName": "UBQA",
                    "monitoringDesc": "DESC",
                    "monitoringStatusLastUpdated": "2021.07.30 07:04:31",
                    "monitoringStatusTimeStamp": "2021.06.09 11:26:44",
                    "monitoringStatusId": 50218,
                    "monitoringId": 611,
                    "criticalTimeSeconds": 0,
                    "systemName": "UB System",
                    "actions": [
                        {
                            "actionId": 0,
                            "actionName": "Other",
                            "actionDesc": "Use this option to write a comment.",
                            "lastUpdated": "2021.07.30 07:06:52"
                        }
                    ],
                    "measurements": [
                        {
                            "measureName": "SENSOR",
                            "actualReading": "100",
                            "actualTime": "2021-04-01T10:07:43",
                            "mainReading": "90",
                            "unitName": " ",
                            "icon": "pos",
                            "ruleTriggered": 1
                        }
                    ]
                }
            ]
        },
        {
            "flagName": "Watchlist",
            "flagId": 8,
            "flagSequence": 7,
            "colorCode": "#47CE8C",
            "isImportant": false,
            "userName": null,
            "monitoringSituations": [
              
                {
                    "monitoringName": "valve",
                    "monitoringStatusMessage": "Activated by Dev User",
                    "situationName": "vfgg",
                    "monitoringDesc": "k",
                    "monitoringStatusLastUpdated": "2021.06.29 07:04:14",
                    "monitoringStatusTimeStamp": "2021.06.29 07:04:14",
                    "monitoringStatusId": 50229,
                    "monitoringId": 620,
                    "criticalTimeSeconds": null,
                    "systemName": "QA-1",
                    "actions": [],
                    "measurements": [
                        {
                            "measureName": "SENSOR",
                            "actualReading": "100",
                            "actualTime": "2021-04-01T10:07:43",
                            "mainReading": "90",
                            "unitName": " ",
                            "icon": "pos",
                            "ruleTriggered": 1
                        }
                    ]
                }
            ]
        },
    ]

export const flagApi = async (request, source = 'login') => {
    let data = {};
    if (source == 'action') {
        const { companyId, userId } = request;
        url = `${API_URL}/api/statusactions/getstatusactions?companyId=${companyId}&userId=${userId}`;
    }
    else {
        const { companyId, userId } = request.result.result;
        url = `${API_URL}/api/statusactions/getstatusactions?companyId=${companyId}&userId=${userId}`;
    }
   
    try {
        const { data: { statusCode, result,message } } = await axios.get(url);
        if (statusCode == 200) {
            // console.log(result);
            if (result.length != 0) {
                data = {
                    'data': result,
                    // 'data': mock_data,
                    'hitTime':moment()
                }
            }
            else{
                // DataEmpty();
                data = {
                    'data': null,
                    'hitTime':moment()
                }
            }
        }
        else {
            // CheckDevice(message)
            data = {
                'data': null,
                'hitTime':moment()
            }
        }
    }
    catch (error) {
        // CheckDevice(error)
        console.log(error);
    }
    return data
}

export const postApi = async (request) => {
    const url = `${API_URL}/api/statusactions/actionsperformed?companyId=${request.CompanyId}`;
    let api_response = '';
    try {
        axios.post(url, request).then((response) => {
            
            if(response.data.statusCode != 200){
               api_response =  'Something went wrong on api side';
            }
            else{
                api_response = "success";
            }

            // console.log(response)
        }, (error) => {
            // CheckDevice(error)
            console.log(error);
        });
    }
    catch (error) {
        // CheckDevice(error)
        console.log(error)
    }
    return api_response;
}
export const getHistory = async (companyId, monitoringstatusId) => {
    let data = {};
    url = `${API_URL}/api/statusactions/getmonitoringstatushistory?monitoringId=${monitoringstatusId}&companyId=${companyId}`;
    try {
        const { data: { statusCode, result,message } } = await axios.get(url);
        if (statusCode == 200) {
            // console.log(result);
            if (result.length != 0) {
                data = {
                    'data': result
                }
            }
            else{
                // DataEmpty();
                data = {
                    'data': null
                }
            }
        }
        else {
            // CheckDevice(message);
            data = {
                'data': null
            }
        }
    }
    catch (error) {
        // CheckDevice(error)
        console.log(error);
    }
    return data
}

export const postNotification = async (request) => {
    const url = `${API_URL}/api/notifications/pushnotifications/sendtoall`;
    try {
        axios.post(url, request).then((response) => {
            // console.log(response)
        }, (error) => {
            // CheckDevice(error)
            console.log(error);
        });
    }
    catch (error) {
        // CheckDevice(error)
        console.log(error)
    }
}

export const getSensors = async (companyId,userId) => {
  //  export const getSensors = () => {
    let data = {};
  url = `${API_URL}/api/statusactions/getsensors?userId=${userId}&companyId=${companyId}`;
    try {
      const { data: { statusCode, result,message } } = await axios.get(url);
     

        if (statusCode == 200) {
            // console.log(result);
            if (result.length != 0) {
                data = {
                    'data': result
                }
            }
            else{
                // DataEmpty();
                data = {
                    'data': null
                }
            }
        }
        else {
            // CheckDevice(message);
            data = {
                'data': null
            }
        }
    }
    catch (error) {
        // CheckDevice(error)
        console.log(error);
    }
    return data
}