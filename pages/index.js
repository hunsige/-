import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { load(); }, []);

  const buy = async (p) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p)
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Candy Store 🍬</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        {products.map(p => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: 20 }}>
            <img src={p.image} style={{ width: "100%" }} />
            <h3>{p.name}</h3>
            <p>{p.price}</p>
            <button onClick={() => buy(p)}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
