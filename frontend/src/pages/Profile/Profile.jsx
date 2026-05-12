import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userApi } from "../../api/api";
import { PageHeader } from "../../components/UI/UI";
import toast from "react-hot-toast";
import "./Profile.css";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    favouriteFlower: user?.favouriteFlower || "",
  });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      if (form.name !== user.name) formData.append("name", form.name);
      if (form.favouriteFlower !== (user.favouriteFlower || ""))
        formData.append("favouriteFlower", form.favouriteFlower);
      if (image) formData.append("image", image);

      // Check if there's anything to update
      let hasChanges = false;
      for (const _ of formData.entries()) {
        hasChanges = true;
        break;
      }

      if (!hasChanges) {
        toast("No changes to save");
        setSaving(false);
        return;
      }

      await userApi.updateProfile(formData);
      await refreshUser();
      setImage(null);
      toast.success("Profile updated! ✨");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container">
        <PageHeader title="My Profile" subtitle="Manage your account details" />

        <div className="profile-layout">
          {/* Profile card */}
          <div className="profile-card">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="profile-card__avatar"
              />
            ) : (
              <div className="profile-card__avatar-placeholder">🌻</div>
            )}

            <h2 className="profile-card__name">{user.name}</h2>
            <p className="profile-card__email">{user.email}</p>

            {user.favouriteFlower && (
              <span className="profile-card__flower">
                🌸 {user.favouriteFlower}
              </span>
            )}

            {user.role === "admin" && (
              <div style={{ marginTop: "var(--space-sm)" }}>
                <span className="profile-card__role">Admin</span>
              </div>
            )}

            <p className="profile-card__joined">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Edit form */}
          <div className="profile-edit">
            <h3 className="profile-edit__title">Edit Profile</h3>

            <form
              className="profile-edit__form"
              onSubmit={handleSubmit}
              id="profile-edit-form"
            >
              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">
                  Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-flower">
                  Favourite Flower
                </label>
                <input
                  id="profile-flower"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sunflower"
                  value={form.favouriteFlower}
                  onChange={(e) =>
                    setForm({ ...form, favouriteFlower: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-image">
                  Profile Picture
                </label>
                <input
                  id="profile-image"
                  type="file"
                  className="form-file-input"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={saving}
                id="profile-save-btn"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
