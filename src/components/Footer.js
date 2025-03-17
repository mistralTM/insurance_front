import React from 'react';

const Footer = () => {
return (
<footer style={styles.footer}>
<div style={styles.container}>
<p style={styles.text}>© 2024 Insurance Company. All rights reserved.</p>
</div>
</footer>
);
};

const styles = {
footer: {
backgroundColor: '#333',
color: '#fff',
padding: '10px 20px',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
position: 'fixed',
bottom: '0',
width: '100%',
},
container: {
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
width: '100%',
},
text: {
fontSize: '1rem',
margin: '0',
},
};

export default Footer;