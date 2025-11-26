//lets the user switch between Chats and Contacts tabs

import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();//return the selected tab (chats or contacts)

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <button
        onClick={() => setActiveTab("chats")} //if chat is set 
        className={`tab ${
          activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400" //highlight that color tab
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")} //else contact
        className={`tab ${
          activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}
//when tab is active its Cyan background + cyan text
// and when tab is inactive its grey color text
export default ActiveTabSwitch;