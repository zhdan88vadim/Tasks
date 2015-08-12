using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServer.DatabaseAccess
{
    public class UserRepository
    {
        private static DataServerEntities _dataServerDb;
        private static DataServerEntities DataServerDb
        {
            get { return _dataServerDb ?? (_dataServerDb = new DataServerEntities()); }
        }

        public IEnumerable<User> GetAll()
        {
            var query = DataServerDb.Users;
            return query.ToList();
        }

        public User Get(int id)
        {
            return DataServerDb.Users.FirstOrDefault(x => x.ID == id);
        }

        public bool Update(User user)
        {
            var item = DataServerDb.Users.FirstOrDefault(x => x.ID == user.ID);
            if (item != null)
            {
                item.Name = user.Name;
                item.Login = user.Login;
                item.Phone = user.Phone;
                item.Password = user.Password;

                return true;
            }
            return false;
        }

        public void Add(User user)
        {
            DataServerDb.Users.Add(user);
            DataServerDb.SaveChanges();
        }

        public void Delete(int id)
        {
            var item = DataServerDb.Users.FirstOrDefault(x => x.ID == id);
            if (item != null)
            {
                DataServerDb.Users.Remove(item);
                DataServerDb.SaveChanges();
            }
        }

    }
}
