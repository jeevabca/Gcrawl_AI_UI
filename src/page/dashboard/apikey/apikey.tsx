import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiEye,
  FiEyeOff,
  FiCopy,
  FiTrash2,
  FiPlus,
  FiX,
  FiKey
} from "react-icons/fi";
import "./apikey.css";

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  createdOn: string;
}

export default function Apikey() {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: "key_1",
      name: "Default",
      key: "fc-ff556c7a1184f3e69fbdc80126aef65d8639e2690595",
      createdOn: "Jan 20, 2026 4:46 PM",
    }
  ]);

  // Track which API Keys have visible unmasked values
  const [visibleKeyIds, setVisibleKeyIds] = useState<Record<string, boolean>>({});

  // Modal states for creating a new key
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeyIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getMaskedKey = (key: string, isVisible: boolean) => {
    if (isVisible) return key;

    // Mask the middle of the key, keep prefix and last 8 chars
    const prefix = key.slice(0, 8);
    const suffix = key.slice(-8);
    return `${prefix}••••••••••••••••••••${suffix}`;
  };

  const handleCopyKey = (key: string) => {
    try {
      navigator.clipboard.writeText(key);
      toast.success("API key copied to clipboard!");
    } catch (err) {
      console.warn("Clipboard access denied:", err);
      toast.error("Failed to copy API key");
    }
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }

    // Generate authentic key token matching format
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const generatedToken = `fc-${newKeyName.toLowerCase().slice(0, 3)}-${randomHex.slice(0, 32)}`;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }) + " " + now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: newKeyName.trim(),
      key: generatedToken,
      createdOn: formattedDate,
    };

    setApiKeys((prev) => [newKey, ...prev]);
    setNewKeyName("");
    setShowCreateModal(false);
    toast.success(`API key "${newKey.name}" created successfully!`);
  };

  const handleRevokeKey = (id: string, name: string) => {
    if (confirm(`Are you sure you want to revoke the API key "${name}"? This action cannot be undone.`)) {
      setApiKeys((prev) => prev.filter((key) => key.id !== id));
      toast.success(`API key "${name}" has been revoked.`);
    }
  };

  return (
    <div className="apikey-page-container">
      {/* Premium Graphic Header */}
      <div className="apikey-page-header">
        <div className="header-text-content">
          <h1>API Keys</h1>
          <p>Create and manage API keys to authenticate with the GcrawlAI API</p>
        </div>
      </div>

      {/* Main Keys List Box Card */}
      <div className="apikey-content-card">
        <div className="card-top-header">
          <h2>Your API Keys</h2>
          <button
            className="create-key-trigger-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus className="btn-icon" />
            <span>Create</span>
          </button>
        </div>

        <div className="keys-list-wrapper">
          {apiKeys.length > 0 ? (
            apiKeys.map((keyItem) => {
              const isVisible = !!visibleKeyIds[keyItem.id];
              return (
                <div key={keyItem.id} className="key-item-row-card">
                  <div className="key-row-details">
                    <span className="key-name-label">{keyItem.name}</span>
                    <button
                      className="revoke-key-btn"
                      onClick={() => handleRevokeKey(keyItem.id, keyItem.name)}
                      title="Revoke API Key"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="key-token-container">
                    <span className="key-token-text">
                      {getMaskedKey(keyItem.key, isVisible)}
                    </span>

                    <div className="key-action-buttons">
                      <button
                        className="key-action-icon-btn"
                        onClick={() => toggleKeyVisibility(keyItem.id)}
                        title={isVisible ? "Hide API Key" : "Show API Key"}
                      >
                        {isVisible ? <FiEyeOff /> : <FiEye />}
                      </button>

                      <button
                        className="key-action-icon-btn"
                        onClick={() => handleCopyKey(keyItem.key)}
                        title="Copy to Clipboard"
                      >
                        <FiCopy />
                      </button>
                    </div>
                  </div>

                  <div className="key-meta-info">
                    Created on {keyItem.createdOn}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-keys-state">
              <div className="empty-icon-wrapper">
                <FiKey className="empty-key-icon" />
              </div>
              <h3>No API keys found</h3>
              <p>Create a secret key to authenticate your scraper apps with GcrawlAI</p>
            </div>
          )}
        </div>
      </div>

      {/* Sleek Create Key Form Modal Dialog */}
      {showCreateModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowCreateModal(false)}>
          <div
            className="create-key-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Create New API Key</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="modal-form-content">
              <div className="form-group-item">
                <label htmlFor="keyName">Key Name</label>
                <input
                  type="text"
                  id="keyName"
                  placeholder="e.g. Production Backend"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  autoFocus
                  maxLength={25}
                />
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit-btn"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}