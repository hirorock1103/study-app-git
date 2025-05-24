import LoginCheck from "../components/LoginCheck";
import HeaderTemplate from "../components/HeaderTemplate";
import TopPageTemplate from "../components/TopPageTemplate";

export default function Home() {
  return (
    <div>
      <LoginCheck>
        <HeaderTemplate></HeaderTemplate>
        <TopPageTemplate></TopPageTemplate>
      </LoginCheck>
    </div>
  );
}
