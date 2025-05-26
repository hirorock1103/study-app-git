import axios from "axios";

//githubブランチの最新コミットをDBに反映
export const getGithubBranchesLatestCommit = async (
  repo_name: string,
  branch_name: string,
  since?: string
) => {
  const baseUrl = "http://localhost:8080";
  const response = await axios.get(
    //${APP_URL}/api/user/github?repo=wonderwall&owner=hirorock1103&branch=stg&since=2025-05-01
    `${baseUrl}/api/user/github?repo=${repo_name}&owner=hirorock1103&branch=${branch_name}&since=${since}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  console.log(response.data);
  return response.data;
};
