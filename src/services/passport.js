import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// and import User

// options for local strategy, we'll use email
// not have separate ones
const localOptions = { usernameField: 'email' };

// options for jwt strategy
// we'll pass in the jwt in an `authorization` header
// so passport can find it there
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: PROCESS.env.AUTH_SECRET, // should be 
};

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // user = SELECT USER WHERE EMAIL == email
    const user = {}
    /*
   (err, user) => {
    if (err) { return done(err); }

    if (!user) { return done(null, false); }
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        done(err);
      } else if (!isMatch) {
        done(null, false);
      } else {
        done(null, user);
      }
    });
  }); */
});

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  /*User.findById(payload.sub, (err, user) => {
    if (err) {
      done(err, false);
    } else if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });*/
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });
