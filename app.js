import ldap from "ldapjs";

const getADUsers = (callback) => {
  const client = ldap.createClient();
};

console.log(getADUsers());
