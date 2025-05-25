import LoginCheck from "../components/LoginCheck";
import HeaderTemplate from "../components/HeaderTemplate";
import GithubRepositoryTemplate from "../components/GithubRepositoryTemplate";

export default function Home() {
  return (
    <div>
      <LoginCheck>
        <HeaderTemplate></HeaderTemplate>
        <GithubRepositoryTemplate></GithubRepositoryTemplate>
      </LoginCheck>
    </div>
  );
}
