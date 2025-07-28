// Container styles
export const containerStyles = {
  main: {
    mt: { xs: 1, sm: 4 }, 
    mb: { xs: 1, sm: 4 }, 
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    px: { xs: 1, sm: 3 },
    '&::before': {
      content: '""',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      opacity: 0.5,
      zIndex: -1
    }
  },
  header: {
    textAlign: 'center', 
    mb: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    '& h4': {
      color: '#000000',
      fontWeight: 800,
      fontSize: '2.5rem',
      fontFamily: 'Poppins',
      position: 'relative',
      display: 'inline-block',
      mb: 3,
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: -12,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120px',
        height: 4,
        backgroundColor: '#000000',
        borderRadius: 2,
      }
    }
  }
};

// Form styles
export const formStyles = {
  paper: {
    p: { xs: 2, sm: 3, md: 4 },
    borderRadius: 3,
    backgroundColor: '#ffffff',
    position: 'relative',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    '& .MuiTextField-root, & .MuiFormControl-root': {
      backgroundColor: '#ffffff',
      borderRadius: 1,
      '& .MuiOutlinedInput-root': {
        transition: 'all 0.2s ease-in-out',
        '& fieldset': {
          borderWidth: '2px',
          borderColor: 'rgba(0, 0, 0, 0.2)',
        },
        '&:hover fieldset': {
          borderColor: '#000000',
          borderWidth: '2px',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#000000',
          borderWidth: '2.5px',
        }
      },
      '& .MuiInputLabel-root': {
        color: '#666666',
        fontWeight: 500,
        '&.Mui-focused': {
          color: '#000000',
          fontWeight: 600
        }
      },
      '& .MuiInputBase-input': {
        fontSize: '0.95rem',
        padding: '16px 14px',
        fontWeight: 500
      },
      '& .MuiSelect-select': {
        padding: '16px 14px',
        fontWeight: 500
      }
    }
  }
};

// Button styles
export const buttonStyles = {
  primary: {
    mt: 2,
    py: 1.8,
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 2,
    backgroundColor: '#000000',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#333333',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
      transform: 'translateY(-1px)'
    },
    '&:active': {
      transform: 'translateY(1px)'
    }
  },
  captchaRefresh: {
    mb: 3,
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    '&.Mui-disabled': {
      color: 'text.secondary'
    }
  }
};

// Dialog styles
export const dialogStyles = {
  paper: {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  title: {
    backgroundColor: '#f8f8f8',
    borderBottom: '2px solid #e0e0e0',
    pb: 3,
    pt: 3,
    px: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontFamily: 'Poppins'
  },
  content: {
    p: 4
  },
  actions: {
    p: 3,
    backgroundColor: '#f8f8f8',
    borderTop: '1px solid #e0e0e0',
    gap: 2
  }
};

// CAPTCHA styles
export const captchaStyles = {
  container: {
    mt: 4, 
    mb: 4, 
    textAlign: 'center',
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 2,
    p: 4,
    border: '1px solid rgba(0, 0, 0, 0.1)'
  },
  codeBox: {
    maxWidth: '400px', 
    margin: '0 auto',
    p: 3,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
  },
  codeDisplay: {
    fontFamily: 'monospace',
    letterSpacing: '0.5em',
    padding: '20px',
    borderRadius: '8px',
    userSelect: 'none',
    backgroundColor: '#f8f8f8',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    mb: 2,
    fontWeight: 600
  },
  codeInput: {
    '& .MuiInputBase-input': { 
      textAlign: 'center',
      fontSize: '1.2rem',
      letterSpacing: '0.3em',
      fontFamily: 'monospace',
      fontWeight: 600
    }
  }
};

// Common styles
export const commonStyles = {
  poppinsText: {
    fontFamily: 'Poppins'
  },
  sectionTitle: {
    color: '#000000',
    fontWeight: 600,
    mb: 3,
    fontFamily: 'Poppins',
    fontSize: '1.2rem',
    borderBottom: '2px solid #e0e0e0',
    pb: 1
  },
  cardTitle: {
    color: '#000000',
    fontWeight: 600,
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    fontSize: '1.1rem',
    fontFamily: 'Poppins'
  },
  loadingContainer: {
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    py: 1,
    color: 'text.secondary'
  }
}; 