Rails.application.routes.draw do
  # resources :carddecks
  get 'carddecks', to: 'carddecks#index_full'
  get 'carddecks/brief', to: 'carddecks#index_brief'
  get 'carddecks/:id', to: 'carddecks#show'
end