import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        pricing: 'Pricing',
        login: 'Login',
        register: 'Sign Up',
        dashboard: 'Dashboard',
        history: 'History',
        support: 'Support',
        admin: 'Admin',
        logout: 'Logout'
      },
      hero: {
        title: 'AI-Powered Virtual Trading',
        subtitle: 'Maximize your crypto trading potential with our advanced AI assistant',
        cta: 'Get Started',
        cta2: 'Learn More'
      },
      features: {
        title: 'Why Choose VeloxQuant AI',
        feature1: 'AI-Powered Trading',
        feature1Desc: 'Advanced algorithms analyze market trends 24/7',
        feature2: 'Secure Payments',
        feature2Desc: 'Pay with BTC, USDT, or TRX with full security',
        feature3: 'Real-Time Analytics',
        feature3Desc: 'Track your performance with detailed reports'
      },
      howItWorks: {
        title: 'How It Works',
        step1: 'Choose Your Plan',
        step1Desc: 'Select the subscription that fits your needs',
        step2: 'Make Payment',
        step2Desc: 'Pay securely with crypto (BTC, USDT, TRX)',
        step3: 'Start Trading',
        step3Desc: 'Launch 24h cycles and watch your profits grow'
      },
      pricing: {
        title: 'Choose Your Plan',
        monthly: 'per month',
        selectPlan: 'Select Plan'
      },
      auth: {
        loginTitle: 'Login to Your Account',
        registerTitle: 'Create Your Account',
        email: 'Email',
        password: 'Password',
        referralCode: 'Referral Code',
        optional: 'optional',
        loginBtn: 'Login',
        registerBtn: 'Sign Up',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        clickHere: 'Click here'
      },
      dashboard: {
        welcome: 'Welcome',
        balance: 'Total Balance',
        activeCycles: 'Active Cycles',
        totalProfit: 'Total Profit',
        subscription: 'Subscription',
        noSubscription: 'No Active Subscription',
        subscribeNow: 'Subscribe Now',
        startCycle: 'Start New Cycle',
        viewHistory: 'View History'
      },
      billing: {
        title: 'Complete Your Payment',
        selectCurrency: 'Select Cryptocurrency',
        paymentAddress: 'Payment Address',
        copyAddress: 'Copy Address',
        qrCode: 'QR Code',
        amount: 'Amount (USD)',
        txHash: 'Transaction Hash',
        uploadScreenshot: 'Upload Payment Screenshot',
        submit: 'Submit for Review',
        pendingReview: 'Your payment will be reviewed within a few hours',
        paymentSuccess: 'Payment submitted successfully!'
      },
      admin: {
        title: 'Admin Panel',
        pendingPayments: 'Pending Payments',
        approve: 'Approve',
        reject: 'Reject',
        noPayments: 'No pending payments'
      },
      footer: {
        rights: 'All rights reserved',
        terms: 'Terms',
        privacy: 'Privacy',
        support: 'Support'
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        pricing: 'Tarifs',
        login: 'Connexion',
        register: 'Inscription',
        dashboard: 'Tableau de bord',
        history: 'Historique',
        support: 'Support',
        admin: 'Admin',
        logout: 'Déconnexion'
      },
      hero: {
        title: 'Trading Virtuel Piloté par IA',
        subtitle: 'Maximisez votre potentiel de trading crypto avec notre assistant IA avancé',
        cta: 'Commencer',
        cta2: 'En savoir plus'
      },
      features: {
        title: 'Pourquoi Choisir VeloxQuant AI',
        feature1: 'Trading IA',
        feature1Desc: 'Algorithmes avancés analysent les tendances 24/7',
        feature2: 'Paiements Sécurisés',
        feature2Desc: 'Payez avec BTC, USDT ou TRX en toute sécurité',
        feature3: 'Analyses en Temps Réel',
        feature3Desc: 'Suivez vos performances avec des rapports détaillés'
      },
      howItWorks: {
        title: 'Comment Ça Marche',
        step1: 'Choisissez Votre Plan',
        step1Desc: 'Sélectionnez l\'abonnement qui correspond à vos besoins',
        step2: 'Effectuez le Paiement',
        step2Desc: 'Payez en toute sécurité avec crypto (BTC, USDT, TRX)',
        step3: 'Commencez à Trader',
        step3Desc: 'Lancez des cycles de 24h et regardez vos profits augmenter'
      },
      pricing: {
        title: 'Choisissez Votre Plan',
        monthly: 'par mois',
        selectPlan: 'Sélectionner'
      },
      auth: {
        loginTitle: 'Connexion à Votre Compte',
        registerTitle: 'Créer Votre Compte',
        email: 'Email',
        password: 'Mot de passe',
        referralCode: 'Code de Parrainage',
        optional: 'optionnel',
        loginBtn: 'Se connecter',
        registerBtn: 'S’inscrire',
        noAccount: 'Pas encore de compte ?',
        hasAccount: 'Déjà un compte ?',
        clickHere: 'Cliquez ici'
      },
      dashboard: {
        welcome: 'Bienvenue',
        balance: 'Solde Total',
        activeCycles: 'Cycles Actifs',
        totalProfit: 'Profit Total',
        subscription: 'Abonnement',
        noSubscription: 'Aucun Abonnement Actif',
        subscribeNow: 'S\'abonner',
        startCycle: 'Nouveau Cycle',
        viewHistory: 'Voir l\'Historique'
      },
      billing: {
        title: 'Complétez Votre Paiement',
        selectCurrency: 'Sélectionnez la Cryptomonnaie',
        paymentAddress: 'Adresse de Paiement',
        copyAddress: 'Copier l\'Adresse',
        qrCode: 'Code QR',
        amount: 'Montant (USD)',
        txHash: 'Hash de Transaction',
        uploadScreenshot: 'Télécharger la Capture d\'Ecran',
        submit: 'Soumettre pour Validation',
        pendingReview: 'Votre paiement sera vérifié dans quelques heures',
        paymentSuccess: 'Paiement soumis avec succès !'
      },
      admin: {
        title: 'Panneau Admin',
        pendingPayments: 'Paiements en Attente',
        approve: 'Approuver',
        reject: 'Rejeter',
        noPayments: 'Aucun paiement en attente'
      },
      footer: {
        rights: 'Tous droits réservés',
        terms: 'Conditions',
        privacy: 'Confidentialité',
        support: 'Support'
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        pricing: 'Precios',
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        dashboard: 'Panel',
        history: 'Historial',
        support: 'Soporte',
        admin: 'Admin',
        logout: 'Cerrar Sesión'
      },
      hero: {
        title: 'Trading Virtual Impulsado por IA',
        subtitle: 'Maximiza tu potencial de trading cripto con nuestro asistente IA avanzado',
        cta: 'Comenzar',
        cta2: 'Saber Más'
      },
      features: {
        title: 'Por Qué Elegir VeloxQuant AI',
        feature1: 'Trading con IA',
        feature1Desc: 'Algoritmos avanzados analizan tendencias 24/7',
        feature2: 'Pagos Seguros',
        feature2Desc: 'Paga con BTC, USDT o TRX con total seguridad',
        feature3: 'Análisis en Tiempo Real',
        feature3Desc: 'Rastrea tu rendimiento con informes detallados'
      },
      howItWorks: {
        title: 'Cómo Funciona',
        step1: 'Elige Tu Plan',
        step1Desc: 'Selecciona la suscripción que se adapte a tus necesidades',
        step2: 'Realiza el Pago',
        step2Desc: 'Paga de forma segura con cripto (BTC, USDT, TRX)',
        step3: 'Comienza a Operar',
        step3Desc: 'Lanza ciclos de 24h y observa crecer tus ganancias'
      },
      pricing: {
        title: 'Elige Tu Plan',
        monthly: 'por mes',
        selectPlan: 'Seleccionar'
      },
      auth: {
        loginTitle: 'Inicia Sesión en Tu Cuenta',
        registerTitle: 'Crea Tu Cuenta',
        email: 'Correo',
        password: 'Contraseña',
        referralCode: 'Código de Referido',
        optional: 'opcional',
        loginBtn: 'Iniciar Sesión',
        registerBtn: 'Registrarse',
        noAccount: '¿No tienes cuenta?',
        hasAccount: '¿Ya tienes cuenta?',
        clickHere: 'Haz clic aquí'
      },
      dashboard: {
        welcome: 'Bienvenido',
        balance: 'Balance Total',
        activeCycles: 'Ciclos Activos',
        totalProfit: 'Ganancia Total',
        subscription: 'Suscripción',
        noSubscription: 'Sin Suscripción Activa',
        subscribeNow: 'Suscribirse',
        startCycle: 'Nuevo Ciclo',
        viewHistory: 'Ver Historial'
      },
      billing: {
        title: 'Completa Tu Pago',
        selectCurrency: 'Selecciona Criptomoneda',
        paymentAddress: 'Dirección de Pago',
        copyAddress: 'Copiar Dirección',
        qrCode: 'Código QR',
        amount: 'Cantidad (USD)',
        txHash: 'Hash de Transacción',
        uploadScreenshot: 'Subir Captura de Pago',
        submit: 'Enviar para Revisión',
        pendingReview: 'Tu pago será revisado en unas horas',
        paymentSuccess: '¡Pago enviado con éxito!'
      },
      admin: {
        title: 'Panel de Admin',
        pendingPayments: 'Pagos Pendientes',
        approve: 'Aprobar',
        reject: 'Rechazar',
        noPayments: 'No hay pagos pendientes'
      },
      footer: {
        rights: 'Todos los derechos reservados',
        terms: 'Términos',
        privacy: 'Privacidad',
        support: 'Soporte'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;