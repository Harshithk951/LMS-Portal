import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Accessibility } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import FaceUnlock from '../components/FaceUnlock/FaceUnlock';
import '../components/FaceUnlock/FaceUnlock.css';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showFaceUnlock, setShowFaceUnlock] = useState(false);
    const [touchSupported, setTouchSupported] = useState(false);
    const [touchRegistered, setTouchRegistered] = useState(false);
    const [touchMessage, setTouchMessage] = useState('');
    const { login } = useUser();
    const navigate = useNavigate();

    // Memoized storage keys for WebAuthn demo state
    const touchStorage = useMemo(() => ({
        cred: 'touchIdCredentialId',
        user: 'touchIdUserId',
        mail: 'touchIdEmail',
    }), []);

    useEffect(() => {
        const check = async () => {
            if (!('PublicKeyCredential' in window) || !window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable) {
                setTouchSupported(false);
                return;
            }
            const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            setTouchSupported(!!available);
            const credId = localStorage.getItem(touchStorage.cred);
            setTouchRegistered(Boolean(credId));
        };
        check().catch(() => setTouchSupported(false));
    }, [touchStorage]);

    const toBase64Url = (buffer: ArrayBuffer) => {
        const bytes = new Uint8Array(buffer);
        let str = '';
        bytes.forEach(b => { str += String.fromCharCode(b); });
        return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    const fromBase64Url = (base64url: string) => {
        const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
        const str = atob(base64);
        const bytes = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i += 1) bytes[i] = str.charCodeAt(i);
        return bytes.buffer;
    };

    const randomBuffer = (len: number) => {
        const buf = new Uint8Array(len);
        crypto.getRandomValues(buf);
        return buf;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email || 'demo-blind@test.com');
        navigate('/dashboard');
    };

    const handleFaceUnlocked = () => {
        // This app uses demo auth; we log in the provided email (or default demo) after a face is detected.
        setShowFaceUnlock(false);
        login(email || 'demo-blind@test.com');
        navigate('/dashboard');
    };

    const handleRegisterTouchId = async () => {
        if (!touchSupported) {
            setTouchMessage('Touch ID not available on this device/browser.');
            return;
        }
        setTouchMessage('');
        try {
            const userId = randomBuffer(16);
            const publicKey: PublicKeyCredentialCreationOptions = {
                rp: { name: 'InclusiveLMS', id: window.location.hostname },
                user: {
                    id: userId,
                    name: email || 'demo-blind@test.com',
                    displayName: email || 'Demo User',
                },
                challenge: randomBuffer(32),
                pubKeyCredParams: [
                    { type: 'public-key', alg: -7 }, // ES256
                    { type: 'public-key', alg: -257 }, // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    userVerification: 'required',
                },
                timeout: 60000,
                attestation: 'none',
            };

            const cred = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;
            if (!cred?.rawId) throw new Error('No credential returned');

            const credId = toBase64Url(cred.rawId);
            localStorage.setItem(touchStorage.cred, credId);
            localStorage.setItem(touchStorage.user, toBase64Url(userId.buffer));
            localStorage.setItem(touchStorage.mail, email || 'demo-blind@test.com');
            setTouchRegistered(true);
            setTouchMessage('Touch ID registered on this device.');
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Registration failed';
            setTouchMessage(msg.includes('NotAllowed') ? 'Touch ID was cancelled or denied.' : msg);
        }
    };

    const handleTouchIdLogin = async () => {
        const credIdB64 = localStorage.getItem(touchStorage.cred);
        const storedMail = localStorage.getItem(touchStorage.mail) || email || 'demo-blind@test.com';
        if (!touchSupported || !credIdB64) {
            setTouchMessage('Set up Touch ID first.');
            return;
        }
        setTouchMessage('');
        try {
            const allowCreds: PublicKeyCredentialDescriptor[] = [
                {
                    type: 'public-key',
                    id: fromBase64Url(credIdB64),
                    transports: ['internal'],
                },
            ];

            const publicKey: PublicKeyCredentialRequestOptions = {
                challenge: randomBuffer(32),
                allowCredentials: allowCreds,
                timeout: 60000,
                userVerification: 'required',
            };

            await navigator.credentials.get({ publicKey });
            login(storedMail);
            navigate('/dashboard');
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Touch ID sign-in failed';
            setTouchMessage(msg.includes('NotAllowed') ? 'Touch ID was cancelled or denied.' : msg);
        }
    };

    return (
        <main className="login-page">
            <div className="login-bg">
                <div className="hero-orb hero-orb-1" />
                <div className="hero-orb hero-orb-2" />
            </div>
            <motion.div className="login-card card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <div className="login-header">
                    <Accessibility size={40} className="text-gradient" />
                    <h1>Welcome to <span className="text-gradient">InclusiveLMS</span></h1>
                    <p>Sign in to continue your accessible learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form" aria-label="Sign in form">
                    <div className="form-group">
                        <label htmlFor="email" className="label">Email</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input id="email" type="email" className="input input-with-icon" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} aria-describedby="email-desc" />
                        </div>
                        <span id="email-desc" className="sr-only">Enter your email address</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="label">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input id="password" type={showPass ? 'text' : 'password'} className="input input-with-icon" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                            <button type="button" className="pass-toggle btn btn-icon" onClick={() => setShowPass(!showPass)} aria-label={showPass ? 'Hide password' : 'Show password'}>
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                        Sign In <ArrowRight size={18} />
                    </button>

                    <button
                        type="button"
                        className={`btn w-full ${showFaceUnlock ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setShowFaceUnlock(v => !v)}
                        aria-pressed={showFaceUnlock}
                        aria-label="Toggle face unlock"
                        style={{ marginTop: 10 }}
                    >
                        Face Unlock
                    </button>

                    {showFaceUnlock && (
                        <FaceUnlock enabled={showFaceUnlock} onUnlocked={handleFaceUnlocked} />
                    )}

                    {touchSupported ? (
                        <div style={{ marginTop: 12 }} className="card" aria-live="polite">
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Touch ID (WebAuthn)</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                        {touchRegistered ? 'Touch ID set up on this device' : 'Register once, then use Touch ID to sign in here'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleRegisterTouchId}>
                                        {touchRegistered ? 'Re-register' : 'Enable Touch ID'}
                                    </button>
                                    <button type="button" className="btn btn-primary btn-sm" onClick={handleTouchIdLogin}>
                                        Sign in with Touch ID
                                    </button>
                                </div>
                            </div>
                            {touchMessage && (
                                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>{touchMessage}</div>
                            )}
                        </div>
                    ) : (
                        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-tertiary)' }} aria-live="polite">
                            Touch ID not available in this browser/device. Safari or Chrome on macOS with Touch ID is required.
                        </div>
                    )}
                </form>
            </motion.div>
        </main>
    );
}
