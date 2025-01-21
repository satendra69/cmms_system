import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import httpCommon from "src/http-common";
import Swal from 'sweetalert2';
import Logo from '../../../assets/img/NewEvantageLogo1.png';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';

import APIServices from 'src/services/APIServices';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

  const [selectedValue, setSelectedValue] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [site_code, setsite_code] = useState([]);

  const [username, setUsername] = useState('');
  const [Getusername, setGetUsername] = useState('');

  const [site_ID, setsite_ID] = useState('');
  const [site_name, setsite_name] = useState('');

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    Username: Yup.string().required('User name is required'),
    password: Yup.string().required('Password is required'),
  });

  const retrieveAPI = () => {
    APIServices.get_sitecode()
      .then((responseJson) => {
   //  console.log(responseJson, "JSON DATA");
        if (responseJson.data.status === 'SUCCESS') {
          // console.log(responseJson.data.status);

          const cities = responseJson.data.data.map((item) => ({
            label: item.site_name,
            value: item.site_cd,
          }));
          setsite_code(cities);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveAPI();
  }, []);

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const handleChange = (e, newValue) => {
    setSelectedValue(newValue);
    setsite_ID(newValue.value);
    setsite_name(newValue.label);
    setErrorMsg('');
  };

  const getSiteTitle = (site_ID) => {
    const site = site_code.find(item => item.value === site_ID);
    return site ? site.label : "Site not found";
  };
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const Username = data.Username;
    const Password = data.password;

    try {
      if (selectedValue !== '' && selectedValue !== null) {
        authenticate_login(Username, Password);
      } else {
        setErrorMsg('Site Code is required');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : 'Site Code is required');
    }
  });



  const authenticate_login = (Username, Password) => {
    APIServices.authenticate_login(Username, Password, site_ID)
      .then((responseJson) => {
        //  console.log("Login JSON DATA : ", responseJson);

        if (responseJson.data.status === 'SUCCESS') {
          // console.log(responseJson.status);
          const siteName = getSiteTitle(site_ID);
          //console.log("Site Name:", siteName);
          localStorage.setItem('site_title', siteName);

          localStorage.setItem('site_ID', site_ID);
          localStorage.setItem('isLoggedIn', true);

          localStorage.setItem('wkr_mst_wr_status', responseJson.data.data.wkr_mst_wr_status);
          localStorage.setItem('EmpLoginId', responseJson.data.data.mst_rowid);
         // localStorage.setItem('emp_mst_login_id', responseJson.data.data.emp_mst_login_id);
          localStorage.setItem('emp_mst_login_id', responseJson.data.data.emp_mst_login_id.toLowerCase());

          localStorage.setItem('emp_mst_empl_id', responseJson.data.data.emp_mst_empl_id);
          localStorage.setItem('emp_mst_name', responseJson.data.data.emp_mst_name);

          localStorage.setItem('site_name', site_name);

          router.push(PATH_AFTER_LOGIN);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: responseJson.data.message,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          icon: 'error',
          title: 'Oops get_sitecode...',
          text: e,
        });
      });
  };


  const getsiteName = async (username) => {
   // console.log("usernameusername___",username);
    try {
      const responseJson = await httpCommon.get(
        "/get_sitecode_using_user_id.php?UserName=" + encodeURIComponent(username)
      );
      //  console.log("responseJson______site_name",responseJson.data);
      if (responseJson.data.status === "SUCCESS" && Array.isArray(responseJson.data.data) && responseJson.data.data.length > 0) {
        const defaultSite = responseJson.data.data[0].default_site;

        if (defaultSite) {

          const parts = defaultSite.split(" : ");
          const label = parts[1].trim(); // "Evantage CMMS"
          const value = parts[0].trim(); // "MSW"
        //  localStorage.setItem('site_title', label);
        // Set the selected value with label and value
         setSelectedValue({
            label: label,
            value: value
        });
       
        setsite_ID(value);
        }else {
          console.error("default_site is not defined on the first element of data array.");
      }
        //setSelectedValue(responseJson.data.data[0].site_name);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    getsiteName(value);
  };

  const renderHead = (
  
    <Stack spacing={1} sx={{ mb: 3 }} className="LoginImg">
        <img src={Logo} />
      <Typography variant="h4">Hello! let&apos;s get started</Typography>
      <span>Sign in to continue.</span>
    </Stack>
  );

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const renderForm = (
    <Stack spacing={2.5}  sx={{ mb: { xs: 3, md: 5 } }}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <RHFTextField name="Username" label="Username" onUsernameChange={handleUsernameChange} className="loginInputClass" />
      <RHFTextField
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? (
                  <Iconify icon="material-symbols:visibility" />
                ) : (
                  <Iconify icon="ic:sharp-visibility-off" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            border: "none !important", // Forcefully remove the border
          },
        }}
      />

      <Autocomplete
        value={selectedValue}
        onChange={handleChange}
        // options={drpSata}
        options={site_code}
        getOptionLabel={(option) => `${option.label} `}
        getOptionValue={(option) => option.value}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Site Code"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "none !important", // Forcefully remove the border
              },
            }}
          />
        )}

       // renderInput={(params) => <TextField {...params} label="Site Code" variant="outlined" />}
      />
      <div className="CSHREF">
       
        <a href="#">Forgot password?</a>
      </div>
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Stack>
  );

 
  return (
    
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
    
  );
}
