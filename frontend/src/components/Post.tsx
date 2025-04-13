import React from 'react';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
// import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Favorite, FavoriteBorder, MoreVert } from '@mui/icons-material';
import { Checkbox } from '@mui/material';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export interface PostProps {
  id: number;
  creator: string;
  avatar: string;
  description: string;
  image: string;
  createdAt: string;
}

export const Post: React.FC<PostProps> = ({ createdAt, creator, description, id, avatar, image }) => {
  const [expanded, setExpanded] = React.useState(false);
  const comments = [
    {
      name: 'John',
      comment: 'Great post!',
    },
    {
      name: 'Jane',
      comment: 'Thanks for sharing!',
    },
    {
      name: 'Doe',
      comment: 'Interesting perspective.',
    },
  ];

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box flex={4} p={2} key={id}>
      <Card sx={{ margin: 5 }}>
        <CardHeader
          avatar={creator && <Avatar sx={{ bgcolor: red[500] }} src={avatar} aria-label="recipe" />}
          action={
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          }
          title={creator}
          subheader={createdAt}
        />
        <CardMedia
          component="img"
          height="20%"
          src={
            image ||
            'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fm.gettywallpapers.com%2Fwp-content%2Fuploads%2F2021%2F05%2F4k-Wallpaper-Cool-scaled.jpg&f=1&nofb=1&ipt=afaf0ef7f11008fa085e529bcc14b006df25152560ff3ffe1286785ff0441786'
          }
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite sx={{ color: 'red' }} />} />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        {expanded && (
          <CardContent>
            <Typography variant="h6">Comments</Typography>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Box key={index} display="flex" alignItems="center" gap={1} py={1}>
                  <Avatar>{comment.name.charAt(0)}</Avatar>
                  <Typography key={index} variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                    {comment.name}: {comment.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments yet.
              </Typography>
            )}
          </CardContent>
        )}
      </Card>
    </Box>
  );
};
