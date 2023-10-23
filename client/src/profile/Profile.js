function Profile(user) {
  return (
    <div className={""}>
      {user.theU?.user.firstName} {user.theU?.user.middleName}{" "}
      {user.theU?.user.lastName}
    </div>
  );
}

export default Profile;
