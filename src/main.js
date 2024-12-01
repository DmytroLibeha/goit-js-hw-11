import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import getPictures from './js/pixabay-api';
import createMurkup from './js/render-functions';

const litebox = new SimpleLightbox('.list-js a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionClass: 'imageTitle',
});

const form = document.querySelector('.form-js');
const list = document.querySelector('.list-js');
const loader = document.querySelector('.loader');

form.addEventListener('submit', toSubmit);

function toSubmit(evt) {
  evt.preventDefault();

  const { picture } = evt.target.elements;
  const value = picture.value.trim();
  list.innerHTML = '';

  if (!value) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a valid search query!',
      position: 'center',
    });
    return;
  }

  loader.classList.remove('hidden');

  getPictures(value)
    .then(data => {
      loader.classList.add('hidden');

      if (!data.hits.length) {
        iziToast.warning({
          title: 'No Results',
          message: 'No images match your search. Please try another keyword!',
          position: 'center',
        });
        return;
      }

      list.innerHTML = createMurkup(data.hits);
      litebox.refresh();
    })
    .catch(error => {
      loader.classList.add('hidden');
      iziToast.error({
        title: 'Error',
        message: `Something went wrong: ${error.message}. Please try again later.`,
        position: 'center',
      });
      console.error('Error fetching images:', error);
    })
    .finally(() => {
      picture.value = '';
    });
}
