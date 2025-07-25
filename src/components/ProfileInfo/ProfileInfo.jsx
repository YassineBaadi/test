"use client";

import { updateUserDescription } from "@/lib/features/authSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfileInfo() {
  const [profileModal, setProfileModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const { data: session } = useSession();

  // Initialize form data from user when modal opens
  const handleModal = () => {
    setFormData({
      name: user.name || session?.user?.name || "",
      email: user.email || session?.user?.email || "",
      description: user.description || "",
    });
    setProfileModal(!profileModal);
  };

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      setProfileModal(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!user.id) {
      alert("Please wait for user data to synchronize");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Veuillez entrer une adresse email valide");
      return;
    }

    // Check if email is not empty
    if (!formData.email.trim()) {
      alert("L'adresse email ne peut pas être vide");
      return;
    }

    dispatch(
      updateUserDescription({
        userId: user.id,
        name: formData.name,
        email: formData.email,
        description: formData.description,
      })
    ).then(() => {
      setProfileModal(false);
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isOAuthUser = !!session && !user.id;

  if (profileModal) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={handleClickOutside}>
        <div className="bg-neutral-800 p-6 rounded-md w-full max-w-md shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-neutral-100 text-xl font-semibold">
              Modifier le profil
            </h2>
            <button
              className="text-neutral-400 hover:text-neutral-100"
              onClick={() => setProfileModal(false)}>
              <X size={20} />
            </button>
          </div>
          {isOAuthUser ? (
            <div className="text-neutral-300 p-4 bg-neutral-700/50 rounded-md">
              <p>
                Votre profil est en cours de synchronisation. Veuillez réessayer
                dans un moment.
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-neutral-300">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="bg-neutral-700 text-neutral-100 px-4 py-2 rounded-md border border-neutral-600 focus:outline-none focus:border-rosy"
                  placeholder="Entrez votre nom"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-neutral-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="bg-neutral-700 text-neutral-100 px-4 py-2 rounded-md border border-neutral-600 focus:outline-none focus:border-rosy"
                  placeholder="Entrez votre email"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-neutral-300">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="bg-neutral-700 text-neutral-100 px-4 py-2 rounded-md border border-neutral-600 focus:outline-none focus:border-rosy"
                  placeholder="Entrez votre description"
                  onChange={handleChange}
                  value={formData.description}
                  rows={4}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-rosy text-neutral-900 px-4 py-2 rounded-md hover:bg-rosy/80 transition-colors duration-200 text-center font-mono text-sm w-full cursor-pointer">
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="profile-info">
      <ul className="profile-info-list space-y-3">
        <li className="flex justify-between text-neutral-300">
          <button
            className="bg-neutral-800 text-neutral-100 px-4 py-2 rounded-md hover:bg-plum/10 transition-colors duration-200 text-center font-mono text-sm hover:text-pine hover:border-rosy border-2 border-white cursor-pointer w-auto"
            onClick={handleModal}>
            Modifier le profil
          </button>
        </li>
      </ul>
    </section>
  );
}
