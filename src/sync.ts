import * as https from "https";
import * as fs from 'fs';
import { environment } from "./utils";
import * as storage from "./storage";
import * as vscode from "vscode";

export async function initgist(gistkey: string) {
    setGistAuth(gistkey);
}

export async function uploadgist(data: string) {
    //从数据库中获取gistkey与id
    let gistkey = await storage.getGlobalStorageValue_sync("gist");
    let gist_id = await storage.getGlobalStorageValue_sync("gist_id");

    const postData = JSON.stringify({
        "description": "vscode-extensions-profiles config",
        "files": { "vscode-extensions-profiles.json": { "content": data } }
    });

    const options = {
        hostname: 'gist.github.com',
        port: 443,
        path: '/gists/' + gist_id,
        method: 'POST',
        headers: {
            "Host": "api.github.com",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": "Bearer " + gistkey,
            "User-Agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.48 Safari/537.36",
            'Content-Length': Buffer.byteLength(postData),
        }
    };

    const req = https.request(options, (res) => {
        console.log(res);

        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            // 状态码在 200-299 范围内
            console.log('Response statusCode:', res.statusCode);
            vscode.window.showInformationMessage("Upload successfully!");
        } else {
            // 状态码不在 200-299 范围内
            console.error('HTTP Error:', res.statusCode, res.statusMessage);
            vscode.window.showErrorMessage("Upload failed!Please check your gist key then init it!");
        }

        /*
        //输出响应头
        console.log(res.headers);
        console.log("continue");
 
        //输出响应体
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
          console.log("continue");
        });*/
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    req.write(postData);
    req.end();


}

export async function getgist(): Promise<any> {
    //从数据库中获取gistkey与id
    let gistkey = await storage.getGlobalStorageValue_sync("gist");
    let gist_id = await storage.getGlobalStorageValue_sync("gist_id");
    var respData = "";

    const options = {
        hostname: 'gist.github.com',
        port: 443,
        path: '/gists/' + gist_id,
        method: 'GET',
        headers: {
            "Host": "api.github.com",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": `Bearer ` + gistkey,
            "User-Agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.48 Safari/537.36",
            'Content-Length': "0",
        }
    };

    const Prom = new Promise((resolve, reject) => {

        const req = https.request(options, (res) => {

            console.log(res);

            /*
            //输出响应头
            console.log(res.headers);
            console.log("continue");*/

            //输出响应体
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                respData = respData + chunk;
                //console.log('BODY: ' + chunk);
                //onsole.log("continue");
            });

            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    // 状态码在 200-299 范围内
                    console.log('Response statusCode:', res.statusCode);
                } else {
                    // 状态码不在 200-299 范围内
                    console.error('HTTP Error:', res.statusCode, res.statusMessage);
                    vscode.window.showErrorMessage("Download failed!Please check your gist key then init it!");
                }
            });

            res.on('close', function () {
                console.log(respData);
                console.log("close");
                resolve(respData);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject("no");
        });

        req.end();
    });
    return Prom;

}

export async function getgistslist(gistkey: string): Promise<any> {
    var respData = "";

    const options = {
        hostname: 'gist.github.com',
        port: 443,
        path: '/gists',
        method: 'GET',
        headers: {
            "Host": "api.github.com",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": `Bearer ` + gistkey,
            "User-Agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.48 Safari/537.36",
            'Content-Length': "0",
        }
    };

    const Prom = new Promise((resolve, reject) => {

        const req = https.request(options, (res) => {

            console.log(res);

            /*
            //输出响应头
            console.log(res.headers);
            console.log("continue");*/

            //输出响应体
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                respData = respData + chunk;
                //console.log('BODY: ' + chunk);
                //onsole.log("continue");
            });

            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    // 状态码在 200-299 范围内
                    console.log('Response statusCode:', res.statusCode);
                } else {
                    // 状态码不在 200-299 范围内
                    console.error('HTTP Error:', res.statusCode, res.statusMessage);
                }
            });

            res.on('close', function () {
                console.log(respData);
                console.log("close");
                resolve(respData);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject("no");
        });

        req.end();
    });

    return Prom;
}

export async function creatgist(gistkey: string) {

    const postData = JSON.stringify({
        "description": "vscode-extensions-profiles config",
        "files": { "vscode-extensions-profiles.json": { "content": "init" } }
    });

    const options = {
        hostname: 'gist.github.com',
        port: 443,
        path: '/gists',
        method: 'POST',
        headers: {
            "Host": "api.github.com",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": "Bearer " + gistkey,
            "User-Agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.48 Safari/537.36",
            'Content-Length': Buffer.byteLength(postData),
        }
    };

    const req = https.request(options, (res) => {
        console.log(res);

        /*
        //输出响应头
        console.log(res.headers);
        console.log("continue");

        //输出响应体
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
          console.log("continue");
        });*/
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.once('finish', () => {
        console.log("creat done");
        checkGistAuth(gistkey);
    });

    // Write data to request body
    req.write(postData);
    req.end();

}

export function setGistAuth(gistkey: string) {
    //首先检查是否已经设置过gistkey
    let gistkeycheck = storage.getGlobalStorageValue_sync("gist");
    gistkeycheck.then(result => {
        if (result == "none") {
            //没有设置过gistkey，则插入一个
            storage.insertGlobalStorageValue(gistkey, "gist");
        } else {
            //已经设置过gistkey，则更新
            storage.setGlobalStorageValue("gist", gistkey);
        }
        //检查gistkey是否有效
        checkGistAuth(gistkey);
    });
}

export function checkGistAuth(gistkey: string): any {
    let profile;
    var respData = getgistslist(gistkey);
    respData.then(result => {
        let jsonObject = JSON.parse(result);
        if (findNestedProperty(jsonObject, "message") == "Bad credentials") {
            vscode.window.showErrorMessage("Bad credentials,please check your gistkey and try again");
            return "Bad credentials";
        }
        //检查是否已经创建过vscode-extensions-profiles.json
        profile = result.search("vscode-extensions-profiles\.json");
        console.log(profile);
        if (profile == -1) {
            //没有创建过vscode-extensions-profiles.json，则创建一个
            creatgist(gistkey);
        } else {
            setGIST_ID(result);
            vscode.window.showInformationMessage("success.now,you can sync your extensions profile");
        }
        //console.log(typeof result);
        console.log("continue");
    });
}

//设置gist_id
export function setGIST_ID(gistslist: string): any {
    let jsonObject = JSON.parse(gistslist);
    //listAllNodeNames(jsonObject);
    //console.log(jsonObject["0"].files["vscode-extensions-profiles.json"].raw_url);
    let url = findNestedProperty(jsonObject, "vscode-extensions-profiles.json").raw_url;
    if (url != undefined) {
        let gist_id = url.match(/\/([a-z0-9]{32})\//);
        storage.insertGlobalStorageValue(gist_id[1], "gist_id");
        return gist_id[1];
    } else {
        return "error";
    }

    //console.log("continue");
}

//一个递归函数，用于遍历对象，比如JSON对象
export function listAllNodeNames(obj: any, parentKey: string = ''): void {
    // 如果是对象或数组，遍历它的键
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // 构造完整的节点名称
                const fullKey = parentKey ? `${parentKey}.${key}` : key;
                console.log(fullKey);
                // 递归处理子节点
                listAllNodeNames(obj[key], fullKey);
            }
        }
    }
}

//一个递归函数，用于查找对象中某个键的值，可以查找多层嵌套的键值
export function findNestedProperty(obj: any, targetPath: string): any {
    function search(obj: any): any {
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];

                    // 检查当前路径是否匹配目标路径
                    if (typeof value === 'object') {
                        const nestedValue = search(value);
                        if (nestedValue !== undefined) {
                            return nestedValue;
                        }
                    }

                    // 检查当前对象是否包含目标路径
                    if (key === targetPath) {
                        return value;
                    }
                }
            }
        }
        return undefined;
    }

    return search(obj);
}

//测试用函数，请忽略
export function syncwriteFile(data: string) {
    //console.log(`${environment.GLOBAL_STORAGE_PATH}`);
    //console.log("continue");
    fs.writeFileSync("./test.js", data);
    let readf = fs.readFileSync("./test.js", "utf8");
    console.log(readf);
}