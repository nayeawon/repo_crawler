import { Octokit } from "octokit";
import * as fs from "fs";
import { writeFileSync, readFileSync } from 'fs';
import { parse } from 'csv-parse';
import { join } from 'path';
import { stringify } from "querystring";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});


module Environment {
    export class Sub {
        owner: string | undefined;
        repo: string | undefined;
        id: number | undefined;
        web_rul: string | undefined;
        title: string | undefined;
        body: string | undefined;
    }
}
var result: string = '';

fs.createReadStream("./assets/repositories.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on(
    "data",
    (row: string[]) => {
        const owner = row[0];
        const repo = row[1];
        
        getIssues(owner, repo).then((issues) => {
            for (var issue of issues.data) {
                var found = false;
                // console.log(issue);
                if (issue.title == null)
                    continue;
                for (var word of issue.title.split(" ")) {
                    if (word.toLowerCase().includes("overflow")) {
                        console.log(owner + "," + repo + "," + issue.id + "," + issue.url + "," + issue.title + "," + issue.body + "\n");
                        let x = owner + "," + repo + "," + issue.id + "," + issue.url + "," + issue.title + "," + issue.body + "\n";
                        result += x as string;
                        found = true;
                        break;
                    }
                }
                if (issue.body == null)
                    continue;
                if (!found) {
                    for (var word of issue.body.split(" ")) {
                        if (word.toLowerCase().includes("overflow")) {
                            console.log(owner + "," + repo + "," + issue.id + "," + issue.url + "," + issue.title + "," + issue.body + "\n");
                            let x = owner + "," + repo + "," + issue.id + "," + issue.url + "," + issue.title + "," + issue.body + "\n";
                            result += x as string;
                            break;
                        }
                    }
                }
            }
            // issues.data.forEach((issue : any)=> {
            //     if (issue.title.split(" ").forEach((word: string) => { word.toLowerCase().includes("overflow") })) {
            //         console.log(issue.owner + "," + issue.repo + "," + issue.id + "," + issue.web_url + "," + issue.title + "," + issue.body + "\n");
            //         result += issue.owner + "," + issue.repo + "," + issue.id + "," + issue.web_url + "," + issue.title + "," + issue.body + "\n";
            //     }

                    
            }
            )
        // });

        
     
        
        
        // getCommits(owner, repo).then((commits) => {
        //     console.log(commits);
        //     commits.data.forEach((commit : any)=> {
        //         console.log(commit.commit.message);
        //         commit.commit.title.split(" ").forEach((word: string) => {
        //             if (word.toLowerCase().includes("overflow")) {
        //                 console.log(`owner: ${owner}, repo: ${repo}, commit: ${commit.commit.message}`);
        //             }
        //         })
        //     });
        }
        
        );
        console.log(result)
        fs.writeFileSync('./foo.txt', result);
    
    
  


function getCommits( owner:string, repo:string ) {
    return octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: owner,
        repo: repo
    });
}

function getIssues(owner:string, repo:string) {
    return octokit.request('GET /repos/{owner}/{repo}/issues?state=all', {
        owner: owner,
        repo: repo
    });
    
}



// try {
//     const { data } = await octokit.request("GET /repos/{owner}/{repo}/issues", {
//         owner: "ISEL-HGU",
//         repo: "ASTChangeAnalyzer"
//     });
//     console.log(data);
// } catch (error) {
//     console.error(error);
// }