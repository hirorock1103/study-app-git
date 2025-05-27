import axios from "axios";

interface Branch {
  branchName: string;
  sha: number;
}

export const getGithubBranches = async (
  repo_name: string,
  since: string,
  until: string
) => {
  const baseUrl = "http://localhost:8080";
  const response = await axios.get(
    `${baseUrl}/api/user/github/db/branches?repository_name=${repo_name}&since=${since}&until=${until}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  console.log(response.data);

  return response.data.data as Branch[];
};
