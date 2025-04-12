import { Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LocalBarIcon from "@mui/icons-material/LocalBar";

import styles from "./NotFoundScreen.module.scss";

const NotFoundScreen = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LocalBarIcon className={styles.icon} />
        <Typography variant="h4" component="h2" className={styles.title}>
          Page Not Found
        </Typography>
        <Typography variant="body1" className={styles.message}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/" size="large">
          Back Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundScreen;
