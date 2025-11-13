// src/components/AddressAutocomplete.jsx
import React, { useState } from "react";
import "../styles/address-autocomplete.css";

/**
 * Simple frontend-only autocomplete.
 * Accepts an array of suggestions or will generate a few fuzzy matches.
 */
const sample = [
  "MG Road, Bengaluru, Karnataka",
  "Noida Sector 62, Uttar Pradesh",
  "Connaught Place, New Delhi, Delhi",
  "Andheri West, Mumbai, Maharashtra",
  "Bandra Kurla Complex, Mumbai, Maharashtra",
  "Kharadi, Pune, Maharashtra",
];

const AddressAutocomplete = ({ onSelect }) => {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const results = q.trim()
    ? sample.filter((s) => s.toLowerCase().includes(q.toLowerCase()))
    : sample.slice(0, 4);

  return (
    <div className="aa-root">
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
        placeholder="Start typing an address or landmark..."
        aria-label="Address autocomplete"
      />
      {open && results.length > 0 && (
        <ul className="aa-list" role="listbox">
          {results.map((r, idx) => (
            <li key={idx} onClick={() => { onSelect(r); setQ(r); setOpen(false); }} role="option">
              {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
