import "./Header.css";
// ex type pour user
// type User = {
//   readonly firstName: string;
//   readonly lastName: string;
// };
// ex type pour props qui contient un User
// peut s'avérer utilise pour obliger à respecter l'imutabilité des props
// type UserProps = {
//   user: User;
//   children: React.ReactNode; // Assure-toi d'inclure les enfants
// };
function Header(/**{ user, children }: UserProps*/) {
  // console.log(user);
  // const user = {firstName: 'Christophe', lastName: 'Gueroult'}
  return (
    <>
      <div>
        <h1>user name</h1>
        {/* <h1>
          {user.firstName} {user.lastName = 'dede'} // error car lastName en readonly
        </h1> */}
        {/* <Profile /> */}
        {/* {children} */}
      </div>
    </>
  );
}

export default Header;
