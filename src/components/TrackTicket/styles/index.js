// Main container styles
export const containerStyles = {
  main: {
    minHeight: '100vh', 
    bgcolor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    py: 8,
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }
};

// Header styles
export const headerStyles = {
  paper: {
    py: { xs: 1.5, sm: 2 }, 
    px: { xs: 2, sm: 4 }, 
    bgcolor: 'rgba(255, 255, 255, 0.95)',
    borderBottom: '1px solid #e0e0e0',
    color: '#000000',
    borderRadius: 0,
    zIndex: 5,
    position: 'sticky',
    top: 0,
    backdropFilter: 'blur(10px)',
  },
  container: {
    display: 'flex', 
    alignItems: 'center',
    maxWidth: 1280,
    mx: 'auto',
    gap: { xs: 1.5, sm: 2 },
    position: 'relative',
    width: '100%',
  },
  logo: {
    display: 'flex', 
    alignItems: 'center', 
    gap: 1,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8
    }
  },
  title: {
    fontWeight: 800,
    color: "#1e293b",
    fontSize: { xs: '1.1rem', sm: '1.3rem' },
    fontFamily: 'Poppins',
    letterSpacing: '-0.02em',
  },
  adminButton: {
    ml: 'auto',
    color: '#0f172a',
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    '&:hover': {
      backgroundColor: '#e2e8f0',
    }
  }
};

// Form styles
export const formStyles = {
  paper: {
    p: { xs: 3, md: 5 },
    borderRadius: 4,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)'
    }
  },
  title: {
    mb: 4,
    fontWeight: 700,
    color: '#000000',
    fontFamily: 'Poppins'
  },
  subtitle: {
    mb: 4,
    color: '#455a64',
    fontWeight: 500,
    letterSpacing: '0.5px',
    fontSize: '0.9rem',
    fontFamily: 'Poppins',
    animation: 'fadeIn 0.5s ease-out 0.4s both',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      transition: 'all 0.3s ease',
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#000000',
        }
      },
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderWidth: 2,
          borderColor: '#000000'
        }
      }
    }
  },
  button: {
    py: 2,
    px: 4,
    fontSize: '1.1rem',
    textTransform: 'none',
    borderRadius: 2,
    fontWeight: 600,
    bgcolor: '#000000',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    '&:hover': {
      bgcolor: '#333333',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-2px)'
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  }
};

// Ticket details styles
export const ticketStyles = {
  paper: {
    p: 4, 
    borderRadius: 3,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '1px solid rgba(37, 99, 235, 0.1)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.03)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #2563eb, #3b82f6, #06b6d4)',
    }
  },
  header: {
    mb: 4,
    pb: 3,
    borderBottom: '2px solid rgba(37, 99, 235, 0.1)',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    mx: -4,
    mt: -4,
    px: 4,
    pt: 6,
    borderRadius: '12px 12px 0 0'
  },
  title: {
    color: '#1e293b',
    fontWeight: 700,
    mb: 3,
    fontFamily: 'Poppins',
    textAlign: 'center',
    letterSpacing: '-0.02em'
  },
  trackingIdBox: {
    maxWidth: 400,
    mx: 'auto',
    p: 3, 
    bgcolor: '#ffffff',
    borderRadius: 2,
    border: '2px solid #2563eb',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
    textAlign: 'center'
  },
  trackingIdLabel: {
    mb: 1, 
    color: '#64748b',
    fontFamily: 'Poppins',
    fontWeight: 500,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  },
  trackingIdValue: {
    fontWeight: 700,
    color: '#2563eb',
    fontFamily: 'Poppins',
    letterSpacing: '0.02em'
  }
};

// Chip styles
export const chipStyles = {
  container: {
    mb: 4,
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  base: {
    px: 3,
    py: 3,
    fontSize: '1rem',
    fontFamily: 'Poppins',
    fontWeight: 600,
    borderRadius: 3,
    '& .MuiChip-icon': {
      fontSize: '1.3rem'
    },
    '& .MuiChip-label': {
      fontFamily: 'Poppins',
      fontWeight: 600
    }
  }
};

// Section styles
export const sectionStyles = {
  container: {
    mb: 4,
    p: 4,
    borderRadius: 3,
    border: '1px solid rgba(37, 99, 235, 0.1)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '4px',
      height: '100%',
      borderRadius: '2px 0 0 2px'
    }
  },
  title: {
    color: '#1e293b',
    fontWeight: 700,
    mb: 3,
    fontFamily: 'Poppins',
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    fontSize: '1.4rem'
  },
  infoCard: {
    p: 3,
    bgcolor: '#ffffff',
    borderRadius: 2,
    border: '1px solid rgba(37, 99, 235, 0.08)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
      transform: 'translateY(-1px)'
    }
  },
  infoLabel: {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    mb: 1.5
  },
  infoValue: {
    fontWeight: 600, 
    fontFamily: 'Poppins',
    color: '#1e293b',
    fontSize: '1rem'
  }
};

// Chat styles
export const chatStyles = {
  container: {
    position: 'fixed',
    bottom: { xs: 20, sm: 30 },
    right: { xs: 20, sm: 30 },
    zIndex: 1000
  },
  widget: {
    position: 'absolute',
    bottom: 80,
    right: 0,
    width: { xs: 320, sm: 380 },
    maxHeight: 500,
    borderRadius: 3,
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '1px solid rgba(37, 99, 235, 0.1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(0)',
    transition: 'all 0.3s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #2563eb, #3b82f6, #06b6d4)',
    }
  },
  header: {
    p: 2.5,
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    borderBottom: '1px solid rgba(37, 99, 235, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  content: {
    p: 3,
    maxHeight: 350,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f5f9'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#cbd5e1',
      borderRadius: '3px'
    }
  },
  toggleButton: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:active': {
      transform: 'scale(0.95)'
    }
  }
};

// Footer styles
export const footerStyles = {
  container: {
    width: '100%',
    py: { xs: 3, sm: 4 },
    px: { xs: 2, sm: 3 },
    textAlign: 'center',
    bgcolor: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    color: '#64748b',
    zIndex: 1
  },
  logoContainer: {
    mb: 2, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 1
  },
  logoText: {
    fontWeight: 700,
    color: "#334155",
    fontSize: '1rem',
    fontFamily: 'Poppins'
  },
  supportText: {
    fontSize: '0.9rem',
    fontFamily: 'Poppins',
    mb: 1
  },
  copyrightText: {
    fontSize: '0.85rem',
    fontFamily: 'Poppins',
    color: '#94a3b8'
  }
}; 