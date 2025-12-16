from data.db import get_session as gs
import sqlmodel as sql
from user.models import User

def reset(username: str, password: str):
    sess = next(gs())
    stmt = sql.select(User).where(User.username == username)
    user = sess.exec(stmt).one_or_none()
    if not user:
        return
    user.set_password(password)
    user.save(sess)