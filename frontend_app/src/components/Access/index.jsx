import React, { useState } from "react";
import { Button, Input } from "antd";
import { getLinks } from "../../utils/bucket";

function Access(props) {
  const [key, setKey] = useState(
    "bafzbeieo6lg3cwiogtvhltqrrhui6chf4s6zxf44hysxkbqha5l66ijgoa"
  );
  const [name, setName] = useState("My file collection");
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState({});
  const [error, setError] = useState("");
  const search = async () => {
    setError("");
    let res;
    setLoading(true);
    try {
      res = await getLinks(name, key);
    } catch (e) {
      setError("Access denied - your name or lookup key may be incorrect.");
    }

    if (!res) {
      setError("Access denied - your name or lookup key may be incorrect.");
      setLinks({});
    } else {
      setLinks(res);
    }
    setLoading(false);
  };
  return (
    <div>
      <br />
      <h3>Unlock your purchased items</h3>
      <p>Enter purchase name and access key below:</p>
      <div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
      </div>
      <div>
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter key"
        />
      </div>
      <Button loading={loading} disabled={loading} onClick={search}>
        Lookup
      </Button>
      <div>
        {error && <p className="red">{error}</p>}
        {links.url && (
          <div>
            <a href={links.url} target="_blank">
              Access contents
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Access;
