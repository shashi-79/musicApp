import DeleteAccount from '../auth/deleteAccount/page';
import Logout from '../auth/logout/page';
import RegisterPage from '../auth/webAuth/register/page';

const Setting: React.FC = () => {
  return (
    <>
      <RegisterPage />
      <Logout />
      <DeleteAccount />
    </>
  );
};

export default Setting;
