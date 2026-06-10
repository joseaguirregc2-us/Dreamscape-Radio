import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../firebase';
import { KeyRound, Mail, AlertTriangle, Sparkles, Loader2, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  
  // Form fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [isOpNotAllowed, setIsOpNotAllowed] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsOpNotAllowed(false);
    setAuthLoading(true);

    if (!email || !password) {
      setError('Por favor, completa todas las credenciales.');
      setAuthLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      let friendlyMessage = 'Ocurrió un error. Intenta de nuevo.';
      if (err.code === 'auth/operation-not-allowed') {
        setIsOpNotAllowed(true);
        friendlyMessage = 'El inicio de sesión por Correo/Contraseña aún no está habilitado en la consola de Firebase para este proyecto.';
      } else if (err.code === 'auth/wrong-password') {
        friendlyMessage = 'Contraseña incorrecta. Por favor vuelve a intentarlo.';
      } else if (err.code === 'auth/user-not-found') {
        friendlyMessage = 'No existe una cuenta registrada con este correo electrónico.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'Este correo electrónico ya está registrado en la frecuencia.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'El formato de correo electrónico ingresado no es válido.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'La contraseña es muy débil (mínimo 6 caracteres).';
      } else if (err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Credenciales no válidas. Por favor, revisa tus datos.';
      }
      setError(friendlyMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsOpNotAllowed(false);
    setAuthLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setIsOpNotAllowed(true);
        setError('El inicio de sesión por Google aún no está habilitado en la consola de Firebase para este proyecto.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError('Error al sintonizar con Google. Intenta nuevamente.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col items-center justify-center font-sans relative overflow-hidden">
        {/* Abstract space lines background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,24,48,0.3),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        
        <div className="relative flex flex-col items-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="text-cyan-500"
          >
            <Compass size={40} className="stroke-[1.5]" />
          </motion.div>
          
          <div className="text-center space-y-1">
            <h2 className="font-mono text-xs uppercase tracking-widest text-slate-400">Sincronizando Frecuencia</h2>
            <p className="text-[10px] text-slate-550 font-mono animate-pulse">ESTABLECIENDO ENLACE COMPROBADO</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#06070a] text-slate-200 flex items-center justify-center font-sans p-4 relative overflow-hidden select-none">
        {/* Background grids and shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(radial,rgba(6,182,212,0.04)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm bg-[#090b11] border border-white/5 rounded-2xl p-6 sm:p-7 shadow-2xl relative z-10 backdrop-blur-md"
          id="auth-card"
        >
          {/* Brand header */}
          <div className="flex flex-col items-center text-center space-y-2 pb-6 border-b border-white/5">
            <div className="p-3 bg-cyan-950/20 text-cyan-400 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center justify-center">
              <Compass size={24} className="animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-lg text-white uppercase tracking-wider">Dreamscape AI</h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans mt-0.5 max-w-[250px] mx-auto">
                Ingresa a la frecuencia de sintonías continuas 24/7 y generación inmersiva espacial
              </p>
            </div>
          </div>

          {/* Form Auth */}
          <form onSubmit={handleEmailAuth} className="mt-6 space-y-4">
            
            {/* SWITCH TABS */}
            <div className="grid grid-cols-2 bg-black/40 p-1 rounded-lg border border-white/5 text-[11px] font-mono leading-none">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(''); }}
                className={`py-2 px-3 rounded-md transition-all duration-300 cursor-pointer text-center font-bold ${
                  !isSignUp ? 'bg-white/[0.04] text-cyan-450 shadow-sm' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                ACCEDER
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(''); }}
                className={`py-2 px-3 rounded-md transition-all duration-300 cursor-pointer text-center font-bold ${
                  isSignUp ? 'bg-white/[0.04] text-cyan-450 shadow-sm' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                REGISTRARSE
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-950/25 border border-red-500/20 rounded-lg space-y-2 text-[10.5px] leading-normal animate-shake">
                <div className="flex items-start gap-2 text-red-400">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                  <span className="font-sans font-medium">{error}</span>
                </div>
                {isOpNotAllowed && (
                  <div className="text-slate-300 bg-black/50 p-2.5 rounded border border-white/5 space-y-2 mt-1.5 leading-relaxed text-[10px]">
                    <p className="font-sans font-semibold text-white">Para solucionar esto en menos de un minuto:</p>
                    <ol className="list-decimal pl-4.5 space-y-1.5 font-sans text-slate-300">
                      <li>Abre la consola de Firebase usando el botón de abajo.</li>
                      <li>Haz clic en <span className="text-cyan-400 font-semibold font-mono text-[9px]">"Agregar proveedor"</span> (Add provider).</li>
                      <li>Selecciona <span className="text-cyan-400 font-semibold font-mono text-[9px]">"Correo electrónico/contraseña"</span> (Email/Password) o <span className="text-cyan-400 font-semibold font-mono text-[9px]">"Google"</span> según el método que quieras habilitar.</li>
                      <li>Activa el interruptor <span className="text-cyan-400 font-semibold">"Habilitar"</span> (Enable) y presiona <span className="text-cyan-400 font-semibold">"Guardar"</span> (Save).</li>
                    </ol>
                    <a 
                      href="https://console.firebase.google.com/project/eco-runway-gsjh2/authentication/providers" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-2 font-mono text-[9px] bg-cyan-400 hover:bg-cyan-350 text-slate-950 font-bold px-2.5 py-1.5 rounded transition duration-200 uppercase tracking-wider text-center w-full"
                    >
                      Abrir Consola de Firebase 🔗
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3.5">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">CORREO ELECTRÓNICO</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Mail size={12} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tunombre@enlace.com"
                    className="w-full pl-8.5 pr-3 py-2 bg-black/30 border border-white/10 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/25 duration-200"
                    id="auth-email-input"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">CONTRASEÑA</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <KeyRound size={12} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignUp ? 'Crea una contraseña segura' : 'Contraseña de sintonizador'}
                    className="w-full pl-8.5 pr-3 py-2 bg-black/30 border border-white/10 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/25 duration-200"
                    id="auth-password-input"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-2 py-2.5 bg-gradient-to-r from-cyan-600 to-medium-teal hover:from-cyan-500 hover:to-cyan-405 text-slate-950 text-xs font-sans font-bold rounded-lg uppercase tracking-wider shadow-lg duration-300 active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              id="auth-btn-submit"
            >
              {authLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={11.5} />
                  <span>{isSignUp ? 'Crear Frecuencia' : 'Comenzar Transmisión'}</span>
                </>
              )}
            </button>
          </form>

          {/* Spacer / Divider */}
          <div className="relative flex py-4.5 items-center">
            <div className="flex-grow border-t border-white/[0.04]"></div>
            <span className="flex-shrink mx-3 text-[8.5px] font-mono text-slate-550 uppercase tracking-widest">O SINTONIZA CON</span>
            <div className="flex-grow border-t border-white/[0.04]"></div>
          </div>

          {/* Google Sign-In Button with Official, modern logo */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            className="w-full py-2.5 px-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 text-slate-200 text-xs font-sans font-semibold rounded-lg duration-300 active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            id="auth-btn-google"
          >
            {/* PRISTINE, LOGO GOOGLE ACTUALIZADO */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22.81-.6z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" fill="#EA4335" />
            </svg>
            <span>Continuar con Google</span>
          </button>

          {/* Footer note */}
          <div className="mt-5 text-center">
            <p className="text-[9px] text-slate-550 font-mono tracking-wider uppercase">
              {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes acceso todavía?'}
              <button 
                type="button" 
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
                className="text-cyan-405 hover:text-cyan-300 underline underline-offset-2 ml-1 cursor-pointer font-bold uppercase transition duration-300"
              >
                {isSignUp ? 'Acceder de inmediato' : 'Crear Cuenta'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
