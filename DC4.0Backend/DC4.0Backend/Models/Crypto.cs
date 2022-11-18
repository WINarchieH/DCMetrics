using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Collections;
using System.Security.Cryptography;


namespace DC4._0Backend.Models
{
    public class Crypto
    {
        private byte[] lbtVector = new byte[] { 240, 3, 45, 29, 0, 76, 173, 59 };
        private string lscryptoKey = "ChangeThis!";

        public string psDecrypt(string sQueryString)
        {
            byte[] buffer = null;
            TripleDESCryptoServiceProvider loCryptoClass = new TripleDESCryptoServiceProvider();
            MD5CryptoServiceProvider loCryptoProvider = new MD5CryptoServiceProvider();

            try
            {
                buffer = Convert.FromBase64String(sQueryString);
                loCryptoClass.Key = loCryptoProvider.ComputeHash(ASCIIEncoding.ASCII.GetBytes(lscryptoKey));
                loCryptoClass.IV = lbtVector;
                return Encoding.ASCII.GetString(loCryptoClass.CreateDecryptor().TransformFinalBlock(buffer, 0, buffer.Length));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                loCryptoClass.Clear();
                loCryptoProvider.Clear();
                loCryptoClass = null/* TODO Change to default(_) if this is not a reference type */;
                loCryptoProvider = null/* TODO Change to default(_) if this is not a reference type */;
            }
        }

       
            public string psEncrypt(string sInputVal)
            {
                string psEncryptRet = default;
                var loCryptoClass = new TripleDESCryptoServiceProvider();
                var loCryptoProvider = new MD5CryptoServiceProvider();
                byte[] lbtBuffer;
                try
                {
                    lbtBuffer = Encoding.ASCII.GetBytes(sInputVal);
                    loCryptoClass.Key = loCryptoProvider.ComputeHash(Encoding.ASCII.GetBytes(lscryptoKey));
                    loCryptoClass.IV = lbtVector;
                    sInputVal = Convert.ToBase64String(loCryptoClass.CreateEncryptor().TransformFinalBlock(lbtBuffer, 0, lbtBuffer.Length));
                    psEncryptRet = sInputVal;
                }
                catch (CryptographicException ex)
                {
                    throw ex;
                }
                catch (FormatException ex)
                {
                    throw ex;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    loCryptoClass.Clear();
                    loCryptoProvider.Clear();
                    loCryptoClass = default;
                    loCryptoProvider = default;
                }

                return psEncryptRet;
            }
        }

    }
