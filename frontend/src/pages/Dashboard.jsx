// import { useEffect, useState } from 'react';
// import API from '../api/axios';
// import Loader from '../components/Loader';
// import SkillChip from '../components/SkillChip';
// import { useAuth } from '../context/AuthContext';

// const emptySkillForm = { teachSkill: [], learnSkill: [], experience: '', availability: '' };

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [profileForm, setProfileForm] = useState({ name: '', city: '', bio: '' });
//   const [skillForm, setSkillForm] = useState(emptySkillForm);
//   const [teachInput, setTeachInput] = useState('');
//   const [learnInput, setLearnInput] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [savingProfile, setSavingProfile] = useState(false);
//   const [savingSkills, setSavingSkills] = useState(false);
//   const [toast, setToast] = useState('');

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [{ data: profileData }, { data: skillData }] = await Promise.all([
//           API.get('/profile'),
//           API.get('/skill'),
//         ]);
//         setProfile(profileData);
//         setProfileForm({ name: profileData.name || '', city: profileData.city || '', bio: profileData.bio || '' });
//         setSkillForm({
//           teachSkill: skillData.teachSkill || [],
//           learnSkill: skillData.learnSkill || [],
//           experience: skillData.experience || '',
//           availability: skillData.availability || '',
//         });
//       } catch (err) {
       
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(''), 2500);
//   };

//   const handleProfileSave = async (e) => {
//     e.preventDefault();
//     setSavingProfile(true);
//     try {
//       const { data } = await API.put('/profile', profileForm);
//       setProfile(data);
//       showToast('Profile updated ✔');
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Updation Failed');
//     } finally {
//       setSavingProfile(false);
//     }
//   };

//   const addTag = (type) => {
//     const value = (type === 'teach' ? teachInput : learnInput).trim();
//     if (!value) return;
//     const key = type === 'teach' ? 'teachSkill' : 'learnSkill';
//     if (skillForm[key].includes(value)) {
//       type === 'teach' ? setTeachInput('') : setLearnInput('');
//       return;
//     }
//     setSkillForm({ ...skillForm, [key]: [...skillForm[key], value] });
//     type === 'teach' ? setTeachInput('') : setLearnInput('');
//   };

//   const removeTag = (type, value) => {
//     const key = type === 'teach' ? 'teachSkill' : 'learnSkill';
//     setSkillForm({ ...skillForm, [key]: skillForm[key].filter((s) => s !== value) });
//   };

//   const handleTagKeyDown = (e, type) => {
//     if (e.key === 'Enter' || e.key === ',') {
//       e.preventDefault();
//       addTag(type);
//     }
//   };

//   const handleSkillSave = async (e) => {
//     e.preventDefault();
//     if (!skillForm.teachSkill.length || !skillForm.learnSkill.length) {
//       showToast('Add at least a teach or a learn Skill');
//       return;
//     }
//     setSavingSkills(true);
//     try {
//       const { data } = await API.post('/skill', skillForm);
//       setSkillForm({
//         teachSkill: data.teachSkill,
//         learnSkill: data.learnSkill,
//         experience: data.experience || '',
//         availability: data.availability || '',
//       });
//       showToast('Skills saved - Now checked matches✔');
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Skills is not save ');
//     } finally { 
//       setSavingSkills(false);
//     }
//   };

//   if (loading) return <Loader label="Profile loading" />;

//   return (
//     <div className="page">
//       {toast && <div className="toast">{toast}</div>}

//       <header className="page-header">
//         <h1>Your profile</h1>
//         <p>This information is visible to other students in the Matches and Swap Requests sections.</p>
//       </header>

//       <div className="dashboard-grid">
//         <form className="panel" onSubmit={handleProfileSave}>
//           <h2>Basic info</h2>

//           <label className="field">
//             <span>Name</span>
//             <input
//               type="text"
//               value={profileForm.name}
//               onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
//             />
//           </label>

//           <label className="field">
//             <span>City</span>
//             <input
//               type="text"
//               value={profileForm.city}
//               onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
//               placeholder=""
//             />
//           </label>

//           <label className="field">
//             <span>Bio</span>
//             <textarea
//               rows={3}
//               value={profileForm.bio}
//               onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
//               placeholder=""
//             />
//           </label>

//           <button className="btn btn-primary" type="submit" disabled={savingProfile}>
//             {savingProfile ? 'Saving…' : 'Save profile'}
//           </button>
//         </form>

//         <form className="panel" onSubmit={handleSkillSave}>
//           <h2>Your skills</h2>
//           <p className="panel-hint">
//            List the skills you can teach and the skills you want to learn so the matching engine can find suitable pairs.
//           </p>

//           <div className="field">
//             <span>You can teach</span>
//             <div className="tag-input">
//               {skillForm.teachSkill.map((s) => (
//                 <SkillChip key={s} label={s} variant="teach" removable onRemove={() => removeTag('teach', s)} />
//               ))}
//               <input
//                 type="text"
//                 value={teachInput}
//                 onChange={(e) => setTeachInput(e.target.value)}
//                 onKeyDown={(e) => handleTagKeyDown(e, 'teach')}
//                 onBlur={() => addTag('teach')}
//                 placeholder=""
//               />
//             </div>
//           </div>

//           <div className="field">
//             <span>You want to learn</span>
//             <div className="tag-input">
//               {skillForm.learnSkill.map((s) => (
//                 <SkillChip key={s} label={s} variant="learn" removable onRemove={() => removeTag('learn', s)} />
//               ))}
//               <input
//                 type="text"
//                 value={learnInput}
//                 onChange={(e) => setLearnInput(e.target.value)}
//                 onKeyDown={(e) => handleTagKeyDown(e, 'learn')}
//                 onBlur={() => addTag('learn')}
//                 placeholder=""
//               />
//             </div>
//           </div>

//           <div className="field-row">
//             <label className="field">
//               <span>Experience level</span>
//               <select
//                 value={skillForm.experience}
//                 onChange={(e) => setSkillForm({ ...skillForm, experience: e.target.value })}
//               >
//                 <option value="">Select</option>
//                 <option>Beginner</option>
//                 <option>Intermediate</option>
//                 <option>Expert</option>
//               </select>
//             </label>

//             <label className="field">
//               <span>Availability</span>
//               <select
//                 value={skillForm.availability}
//                 onChange={(e) => setSkillForm({ ...skillForm, availability: e.target.value })}
//               >
//                 <option value="">Select</option>
//                 <option>Weekdays</option>
//                 <option>Weekends</option>
//                 <option>Evenings</option>
//               </select>
//             </label>
//           </div>

//           <button className="btn btn-primary" type="submit" disabled={savingSkills}>
//             {savingSkills ? 'Saving…' : 'Save skills'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;












import { useEffect, useState } from 'react';
import API from '../api/axios';
import Loader from '../components/Loader';
import SkillChip from '../components/SkillChip';
import { useAuth } from '../context/AuthContext';

const emptySkillForm = { teachSkill: [], learnSkill: [], experience: '', availability: '' };

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', city: '', bio: '', whatsapp: '' });
  const [skillForm, setSkillForm] = useState(emptySkillForm);
  const [teachInput, setTeachInput] = useState('');
  const [learnInput, setLearnInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: profileData }, { data: skillData }] = await Promise.all([
          API.get('/profile'),
          API.get('/skill'),
        ]);
        setProfile(profileData);
        setProfileForm({
          name: profileData.name || '',
          city: profileData.city || '',
          bio: profileData.bio || '',
          whatsapp: profileData.whatsapp || '',
        });
        setSkillForm({
          teachSkill: skillData.teachSkill || [],
          learnSkill: skillData.learnSkill || [],
          experience: skillData.experience || '',
          availability: skillData.availability || '',
        });
      } catch (err) {
        // agar skills abhi tak add nahi hui, blank form hi rehne do
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await API.put('/profile', profileForm);
      setProfile(data);
      showToast('Profile updated ✔');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed. Please try again');
    } finally {
      setSavingProfile(false);
    }
  };

  const addTag = (type) => {
    const value = (type === 'teach' ? teachInput : learnInput).trim();
    if (!value) return;
    const key = type === 'teach' ? 'teachSkill' : 'learnSkill';
    if (skillForm[key].includes(value)) {
      type === 'teach' ? setTeachInput('') : setLearnInput('');
      return;
    }
    setSkillForm({ ...skillForm, [key]: [...skillForm[key], value] });
    type === 'teach' ? setTeachInput('') : setLearnInput('');
  };

  const removeTag = (type, value) => {
    const key = type === 'teach' ? 'teachSkill' : 'learnSkill';
    setSkillForm({ ...skillForm, [key]: skillForm[key].filter((s) => s !== value) });
  };

  const handleTagKeyDown = (e, type) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(type);
    }
  };

  const handleSkillSave = async (e) => {
    e.preventDefault();
    if (!skillForm.teachSkill.length || !skillForm.learnSkill.length) {
      showToast('Please add at least one teach skill and one learn skill');
      return;
    }
    setSavingSkills(true);
    try {
      const { data } = await API.post('/skill', skillForm);
      setSkillForm({
        teachSkill: data.teachSkill,
        learnSkill: data.learnSkill,
        experience: data.experience || '',
        availability: data.availability || '',
      });
      showToast('Skills saved. Now check the Matches tab ✔');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save skills');
    } finally {
      setSavingSkills(false);
    }
  };

  if (loading) return <Loader label="Profile is loading" />;

  return (
    <div className="page">
      {toast && <div className="toast">{toast}</div>}

      <header className="page-header">
        <h1>Your profile</h1>
        <p>This information is visible to other students in Matches and Swap Requests</p>
      </header>

      <div className="dashboard-grid">
        <form className="panel" onSubmit={handleProfileSave}>
          <h2>Basic info</h2>

          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            />
          </label>

          <label className="field">
            <span>City</span>
            <input
              type="text"
              value={profileForm.city}
              onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
              placeholder=""
            />
          </label>

          <label className="field">
            <span>Bio</span>
            <textarea
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder=""
            />
          </label>

          <label className="field">
            <span>WhatsApp number</span>
            <input
              type="text"
              value={profileForm.whatsapp}
              onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
              placeholder=""
            />
            <small className="field-hint">
             This number will only be visible after a swap request has been accepted.
            </small>
          </label>

          <button className="btn btn-primary" type="submit" disabled={savingProfile}>
            {savingProfile ? 'Saving…' : 'Save profile'}
          </button>
        </form>

        <form className="panel" onSubmit={handleSkillSave}>
          <h2>Your skills</h2>
          <p className="panel-hint">
           List both the skills you can teach and the skills you want to learn so the matching engine can find the best matches
          </p>

          <div className="field">
            <span>You can teach</span>
            <div className="tag-input">
              {skillForm.teachSkill.map((s) => (
                <SkillChip key={s} label={s} variant="teach" removable onRemove={() => removeTag('teach', s)} />
              ))}
              <input
                type="text"
                value={teachInput}
                onChange={(e) => setTeachInput(e.target.value)}
                onKeyDown={(e) => handleTagKeyDown(e, 'teach')}
                onBlur={() => addTag('teach')}
                placeholder=""
              />
            </div>
          </div>

          <div className="field">
            <span>You want to learn</span>
            <div className="tag-input">
              {skillForm.learnSkill.map((s) => (
                <SkillChip key={s} label={s} variant="learn" removable onRemove={() => removeTag('learn', s)} />
              ))}
              <input
                type="text"
                value={learnInput}
                onChange={(e) => setLearnInput(e.target.value)}
                onKeyDown={(e) => handleTagKeyDown(e, 'learn')}
                onBlur={() => addTag('learn')}
                placeholder=""
              />
            </div>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Experience level</span>
              <select
                value={skillForm.experience}
                onChange={(e) => setSkillForm({ ...skillForm, experience: e.target.value })}
              >
                <option value="">Select</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
            </label>

            <label className="field">
              <span>Availability</span>
              <select
                value={skillForm.availability}
                onChange={(e) => setSkillForm({ ...skillForm, availability: e.target.value })}
              >
                <option value="">Select</option>
                <option>Weekdays</option>
                <option>Weekends</option>
                <option>Evenings</option>
              </select>
            </label>
          </div>

          <button className="btn btn-primary" type="submit" disabled={savingSkills}>
            {savingSkills ? 'Saving…' : 'Save skills'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
