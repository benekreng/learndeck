class CarddecksController < ApplicationController
  def index_full
    carddecks = Carddeck.all
    render json: carddecks, status: :ok
  end

  def index_brief
    carddeck = Carddeck.select(:id, :title, :description)
    render json: carddeck, status: :ok
  end

  def show
    carddeck = Carddeck.find(params[:id])
    render json: carddeck, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Carddeck not found'}, status: :not_found
  end

  def book_params
    params.require(:book).permit(:title, :author)
  end
end
