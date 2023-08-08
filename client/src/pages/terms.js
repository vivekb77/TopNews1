import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className='page-404-container'>
      
        <div className='header'>
            <div className='logoandtitle'>
                <div className="logoimage"></div>  
                <div className="logonameimage"></div>      
		    </div>
        <hr/>
            <h1>Terms</h1>
           
            <h4>Content Aggregation</h4>
            <p className='terms-para'>
            The Site aggregates news content from various third-party sources. We do not create or modify the content ourselves and are not responsible for its accuracy or reliability.
            </p>
            <p className='terms-para'>
            While we strive to provide accurate and up-to-date information, we do not guarantee the accuracy, completeness, or reliability of the aggregated content. You acknowledge that your use of the content is at your own risk.
            </p>
            <h4>Intellectual Property</h4>
            <p className='terms-para'>
            All aggregated content provided on the Site belongs to their respective owners and is protected by copyright and other applicable intellectual property laws.
            </p>
            <p className='terms-para'>
            You may not reproduce, distribute, modify, or create derivative works based on the aggregated content without the explicit permission of the content owner.
            </p>
            <h4>Disclaimer of Warranties</h4>
            <p className='terms-para'>
            The content provided on the Site is for informational purposes only and does not constitute financial, legal, or professional advice. We do not guarantee the accuracy, completeness, or reliability of any information on the Site.
            </p>
            <p className='terms-para'>
            We are not responsible for any loss, damage, or harm resulting from your use of the Site or reliance on its content.
            </p>
            <h4>Links to Third-Party Websites</h4>
            <p className='terms-para'>
              The Site may contain links to third-party websites. These links are provided for your convenience, and we do not endorse or control the content of these websites. We are not responsible for any content or actions on third-party websites.
            </p>
            <p className='terms-para'>
            If you have any questions or concerns about these Terms and Conditions, please contact us at newsexpressnz@gmail.com
            </p>
            <p className='terms-para'>
            By using the Site, you acknowledge that you have read, understood, and agree to abide by these Terms and Conditions. If you do not agree with these terms, please refrain from using the Site.
            </p>
            <hr/>
            <br/>
            <Link to="/">Go to Home Page</Link>
            <br/>
        </div>
    </div>
  );
};
export default Terms;