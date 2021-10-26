import moment from 'moment';

export default class BaseService {

    protected arrayToHashMap = (arrayOfObj: any, hashKey: string) => {
        const hashMap = {};
        for (const obj of arrayOfObj) {
            hashMap[obj[hashKey].toString()] = obj;
        }
        return hashMap;
    }

    protected arrayToHashMapValue = (arrayOfObj: any, hashKey: string, value: any) => {
        const hashMap = {};
        for (const obj of arrayOfObj) {
            hashMap[obj[hashKey].toString()] = obj[value];
        }
        return hashMap;
    }

}
