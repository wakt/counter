class CreateMftrefunds < ActiveRecord::Migration
  def change
    create_table :mftrefunds do |t|

      t.timestamps
    end
  end
end
