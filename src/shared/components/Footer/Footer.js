import React, { Component } from 'react';
import { Link } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.scss';

class Footer extends Component {

  render() {
    return (
      <div className='container-fluid'>
        <div className={s.footer}>
          <div className='row'>
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <Link to="/about">
                <p className='text-center'>About</p>
              </Link>
            </div>
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <Link to="/contact">
                <p className='text-center'>Contact</p>
              </Link>
            </div>
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <Link to="/privacy">
                <p className='text-center'>Privacy</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default withStyles(s)(Footer);
