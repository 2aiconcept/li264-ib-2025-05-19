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

type User = {
  firstName: string;
  lastName: string;
};

type UserProps = {
  user: User;
  children: React.ReactNode; // Assure-toi d'inclure les enfants
};
function Header({ user, children }: UserProps) {
  // console.log(user);
  // const user = { firstName: "Christophe", lastName: "Gueroult" };
  return (
    <>
      <div>
        <h4>
          {user.firstName} {user.lastName}
        </h4>
        {children}
      </div>
    </>
  );
}

export default Header;
