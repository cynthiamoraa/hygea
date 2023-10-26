import{ useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
  });

  useEffect(() => {
    fetch("http://134.209.116.222/api/husers")
      .then((response) => response.json())
      .then((data) => setUsers(data.products))
      .catch((error) => console.error("Error fetching user data:", error));

    fetch("http://134.209.116.222/api/cards")
      .then((response) => response.json())
      .then((data) => setCards(data.cards))
      .catch((error) => console.error("Error fetching card data:", error));

    fetch("http://134.209.116.222/api/checkins")
      .then((response) => response.json())
      .then((data) => setCheckins(data.checkins))
      .catch((error) => console.error("Error fetching check-in data:", error));
  }, []);

  function generateUserData() {
    const selectedUserIds = users.map((user) => user.id);

    const userData = selectedUserIds.map((userId) => {
      const user = users.find((user) => user.id === userId);
      const userCards = cards
        .filter((card) => Number(card.userid) === userId)
        .map((card) => card.uid);
      const userCheckins = checkins
        .filter((checkin) => Number(checkin.userid) === userId)
        .map((checkin) => checkin.status);
      return {
        id: userId,
        name: user ? user.name : null,
        profession: user ? user.profession : null,
        cardData: userCards.length > 0 ? userCards.join(", ") : null,
        checkinStatus: userCheckins.length > 0 ? userCheckins.join(", ") : null,
      };
    });
    return userData;
  }

  const userData = generateUserData();

  // Function to handle adding a new user
  const handleAddUser = () => {
    // Prepare the request body
    const requestBody = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      profession: newUser.profession,
    };

    // Send a PUT request to add the new user
    fetch("http://134.209.116.222/api/husers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // If the user is successfully added, you can update the users state
        setUsers((prevUsers) => [...prevUsers, data]);
        // Clear the new user input fields
        setNewUser({
          name: "",
          email: "",
          phone: "",
          profession: "",
        });
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  // Function to handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevNewUser) => ({
      ...prevNewUser,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="">
        <div className="p-5 bg-blue-500 ">
          <h1 className="text-center text-3xl">hygea</h1>
        </div>

        <div className="p-6 border-b-2 grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <h2 className="text-xl">User</h2>
            {userData.map((user) => (
              <div key={user.id} className="border-t p-2">
                {user.name ? `${user.name}` : `User ${user.id}`}
              </div>
            ))}
          </div>
          <div className="col-span-1">
            <h2 className="text-xl">Role</h2>
            {userData.map((user) => (
              <div key={user.id} className="border-t p-2">
                {user.profession ? user.profession : "N/A"}
              </div>
            ))}
          </div>
          <div className="col-span-1">
            <h2 className="text-xl">Card</h2>
            {userData.map((user) => (
              <div key={user.id} className="border-t p-2">
                {user.cardData ? user.cardData : "N/A"}
              </div>
            ))}
          </div>
          <div className="col-span-1">
            <h2 className="text-xl">Status</h2>
            {userData.map((user) => (
              <div key={user.id} className="border-t p-2">
                {user.checkinStatus ? user.checkinStatus : "N/A"}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 mt-10 border-b-2 grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={newUser.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="profession"
              placeholder="Profession"
              value={newUser.profession}
              onChange={handleInputChange}
            />
          </div>
          <button
            className="col-span-4 bg-blue-500 text-white p-2 rounded"
            onClick={handleAddUser}
          >
            Add User
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
